import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { confSubpath, uiPort, upsertPreferences } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting qBittorrent!'))

  // Read the password hash reactively, so changing it (via the "Set Admin
  // Password" action) restarts the service automatically.
  const passwordHash = await storeJson
    .read((s) => s.adminPasswordHash)
    .const(effects)

  // Apply the password + reverse-proxy flags to qBittorrent.conf HERE, before
  // the daemon launches — never from the action while the app is running.
  // qBittorrent rewrites its whole config on shutdown, so a write made while
  // it runs is clobbered on the next restart. Writing now (the previous
  // instance has already stopped and flushed) is the last word before start.
  await applyWebUiConfig(passwordHash)

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'qbittorrent' },
      sdk.Mounts.of()
        // App config (qBittorrent.conf, categories, RSS, logs, …)
        .mountVolume({
          volumeId: 'main',
          subpath: 'config',
          mountpoint: '/config',
          readonly: false,
        })
        // Downloaded content + incomplete files. The image's default save
        // path is `/downloads/`; without this mount, downloads land on the
        // container's ephemeral filesystem and are lost on every restart.
        .mountVolume({
          volumeId: 'main',
          subpath: 'downloads',
          mountpoint: '/downloads',
          readonly: false,
        }),
      'qbittorrent-sub',
    ),
    exec: {
      command: sdk.useEntrypoint(),
      // linuxserver images use s6-overlay, which must run as PID 1.
      runAsInit: true,
      // linuxserver images drop privileges to PUID:PGID and set TZ.
      env: { PUID: '1000', PGID: '1000', TZ: 'Etc/UTC' },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})

/**
 * Upsert the Web UI password and the reverse-proxy-compatibility flags into
 * the existing qBittorrent.conf. Only touches a config qBittorrent has already
 * created — on the very first boot (no password set yet) it does nothing, so
 * qBittorrent writes its full set of defaults.
 */
async function applyWebUiConfig(passwordHash?: string | null): Promise<void> {
  const confPath = sdk.volumes.main.subpath(confSubpath)

  let existing: string
  try {
    existing = await readFile(confPath, 'utf8')
  } catch {
    // No config yet (first boot). Let qBittorrent create its defaults; the
    // password isn't set until the user runs the action anyway.
    return
  }

  const entries: Record<string, string> = {
    // Required for logins to work behind the StartOS reverse proxy.
    'WebUI\\HostHeaderValidation': 'false',
    'WebUI\\CSRFProtection': 'false',
    // Always require the password — don't let proxy-local requests skip auth.
    'WebUI\\LocalHostAuth': 'false',
  }
  if (passwordHash) {
    entries['WebUI\\Password_PBKDF2'] = `"${passwordHash}"`
  }

  const updated = upsertPreferences(existing, entries)
  if (updated !== existing) {
    await mkdir(dirname(confPath), { recursive: true })
    await writeFile(confPath, updated)
  }
}
