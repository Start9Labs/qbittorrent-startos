import { createHash } from 'node:crypto'
import { writeFile, mkdir } from 'node:fs/promises'
import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

/**
 * On fresh install, generate a random admin password, store it in
 * store.json, and write the qBittorrent config with the password hash.
 *
 * The config includes the full defaults from the linuxserver/qbittorrent
 * image plus our WebUI\Password hash. This ensures the entrypoint
 * finds a valid config on first run and doesn't overwrite it.
 */
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  const adminPassword = utils.getDefaultString({
    charset: 'a-z,A-Z,0-9',
    len: 32,
  })

  // Store plaintext password in our store for retrieval by actions
  await storeJson.merge(effects, { adminPassword })

  // Write the qBittorrent config with the password hash
  const passwordHash = createHash('sha256')
    .update(adminPassword)
    .digest('hex')

  // Config mirrors the linuxserver default config with WebUI\Password added.
  // Key: the WebUI\Password line is added to the [Preferences] section.
  // The entrypoint finds this file on first run and preserves it.
  const confDir = `${sdk.volumes.main}/qBittorrent/qBittorrent`
  const confPath = `${confDir}/qBittorrent.conf`
  await mkdir(confDir, { recursive: true })

  await writeFile(
    confPath,
    [
      '[AutoRun]',
      'enabled=false',
      'program=',
      '',
      '[LegalNotice]',
      'Accepted=true',
      '',
      '[Preferences]',
      'Connection\\UPnP=false',
      'Connection\\PortRangeMin=6881',
      'Downloads\\SavePath=/downloads/',
      'Downloads\\TempPath=/downloads/incomplete/',
      'WebUI\\Address=*',
      'WebUI\\ServerDomains=*',
      `WebUI\\Password=${passwordHash}`,
      '',
    ].join('\n'),
  )

  console.info(i18n('Generated admin password for qBittorrent web UI'))
})
