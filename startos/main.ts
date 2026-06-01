import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { confSubpath, defaultConf, uiPort, upsertPreferences } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting qBittorrent!'))

  // Read the password hash reactively, so changing it (via the "Set Admin
  // Password" action) restarts the service automatically.
  const passwordHash = await storeJson
    .read((s) => s.adminPasswordHash)
    .const(effects)

  // Prepare qBittorrent.conf HERE, before the daemon launches — never from the
  // action while the app is running. qBittorrent rewrites its whole config on
  // shutdown, so a write made while it runs is clobbered on the next restart;
  // writing now (the previous instance has already stopped and flushed) is the
  // last word before start. On first boot this seeds a complete config so the
  // Web UI loads through the StartOS proxy immediately; thereafter it just
  // applies the latest password into the config qBittorrent maintains.
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
 * Ensure qBittorrent.conf has the reverse-proxy-compatibility flags (and the
 * admin password, once set) before the daemon launches.
 *
 * On first boot no config exists yet, so we seed a complete one (`defaultConf`)
 * — qBittorrent then preserves it. The flags must be present from this first
 * boot or the Web UI rejects every proxied request with a blank "Unauthorized".
 * On later boots we upsert into the config qBittorrent maintains, preserving
 * the user's settings.
 */
async function applyWebUiConfig(passwordHash?: string | null): Promise<void> {
  const confPath = sdk.volumes.main.subpath(confSubpath)

  let existing: string
  try {
    existing = await readFile(confPath, 'utf8')
  } catch {
    existing = '' // first boot — seed from defaultConf below
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

  const updated = upsertPreferences(existing || defaultConf, entries)
  if (updated !== existing) {
    await mkdir(dirname(confPath), { recursive: true })
    await writeFile(confPath, updated)
  }
}
