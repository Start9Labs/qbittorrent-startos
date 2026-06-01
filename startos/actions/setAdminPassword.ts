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
      'Generate a new random password for the qBittorrent web UI admin account. The new password is applied immediately.',
    ),
    warning: i18n(
      'If the service is running, the web UI will disconnect. Restart the service to apply.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) => {
    const adminPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 32,
    })

    // Store plaintext password in our store
    await storeJson.merge(effects, { adminPassword })

    // Write SHA-256 hash to qBittorrent config so it takes effect
    const passwordHash = createHash('sha256')
      .update(adminPassword)
      .digest('hex')

    const confDir = `${sdk.volumes.main}/qBittorrent/qBittorrent`
    const confPath = `${confDir}/qBittorrent.conf`

    await mkdir(confDir, { recursive: true })

    // Read existing config to preserve other settings, then update the password line
    let existingContent = ''
    try {
      existingContent = (await readFile(confPath, 'utf8')).toString()
    } catch {
      // File doesn't exist yet — happens on first password set
    }

    // Replace any existing WebUI\Password line, or add it if missing
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
        'Use these credentials to sign in to the qBittorrent web UI.',
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
