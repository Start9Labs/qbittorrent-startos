import { createHash } from 'node:crypto'
import { writeFile, mkdir } from 'node:fs/promises'
import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

/**
 * On fresh install, generate a random admin password, write the SHA-256
 * hash to the qBittorrent config and to store.json. The user runs the
 * "Set Admin Password" action to generate and view their credentials.
 *
 * Plaintext is never persisted — only the hash is stored.
 */
export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  // Generate a temporary password so the config has a valid hash.
  // The user will replace it via the "Set Admin Password" action.
  const adminPassword = utils.getDefaultString({
    charset: 'a-z,A-Z,0-9',
    len: 32,
  })

  const passwordHash = createHash('sha256').update(adminPassword).digest('hex')

  // Store only the hash — never plaintext
  await storeJson.merge(effects, { adminPasswordHash: passwordHash })

  // Write full qBittorrent config with the password hash
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

  console.info(i18n('Run the "Set Admin Password" action to set your web UI credentials'))
})
