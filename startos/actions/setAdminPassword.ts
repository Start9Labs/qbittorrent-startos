import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

export const setAdminPassword = sdk.Action.withoutInput(
  'set-admin-password',
  async () => ({
    name: i18n('Set Admin Password'),
    description: i18n(
      'Generate a new random password for the qBittorrent web UI admin account. The service restarts automatically to apply it.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) => {
    const adminPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 32,
    })

    const passwordHash = createHash('sha256')
      .update(adminPassword)
      .digest('hex')

    // Store only the hash — never plaintext
    await storeJson.merge(effects, { adminPasswordHash: passwordHash })

    // Write SHA-256 hash to qBittorrent config so it takes effect
    const confDir = `${sdk.volumes.main}/qBittorrent/qBittorrent`
    const confPath = `${confDir}/qBittorrent.conf`
    await mkdir(confDir, { recursive: true })

    // Read existing config to preserve other settings
    let existingContent = ''
    try {
      existingContent = (await readFile(confPath, 'utf8')).toString()
    } catch {
      // Config doesn't exist yet
    }

    // Replace or add the WebUI\Password line
    const passwordLine = `WebUI\\Password=${passwordHash}`
    const updatedContent = existingContent
      ? existingContent
          .split('\n')
          .map((line) =>
            line.startsWith('WebUI\\Password=') ? passwordLine : line,
          )
          .join('\n')
      : passwordLine

    await writeFile(confPath, updatedContent + '\n')

    return {
      version: '1',
      title: i18n('Login Credentials'),
      message: i18n(
        'Use these credentials to sign in to the qBittorrent web UI. The service is restarting automatically.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: 'admin',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: adminPassword,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
