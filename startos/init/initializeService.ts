import { createHash } from 'node:crypto'
import { writeFile, mkdir } from 'node:fs/promises'
import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

/**
 * On fresh install, generate a random admin password, store it in
 * store.json, and write the SHA-256 hash to the qBittorrent config.
 *
 * Writing the config here (in init) ensures the entrypoint's default
 * copy is skipped on first run, so our password survives the startup.
 */
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  const adminPassword = utils.getDefaultString({
    charset: 'a-z,A-Z,0-9',
    len: 32,
  })

  // Store plaintext password in our store for retrieval by actions
  await storeJson.merge(effects, { adminPassword })

  // Write the WebUI password hash directly to the volume so the
  // qBittorrent entrypoint finds it on first run and doesn't
  // overwrite with the default (which has no password = default creds).
  const passwordHash = createHash('sha256')
    .update(adminPassword)
    .digest('hex')

  const confPath = `${sdk.volumes.main}/qBittorrent/qBittorrent/qBittorrent.conf`
  await mkdir(`${sdk.volumes.main}/qBittorrent/qBittorrent`, { recursive: true })

  // Minimal config with just the password — the entrypoint merges this
  // with its defaults, so we only need to set the password here.
  await writeFile(confPath, `WebUI\\Password=${passwordHash}\n`)

  console.info(i18n('Generated admin password for qBittorrent web UI'))
})
