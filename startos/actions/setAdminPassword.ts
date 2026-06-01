import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { qbPasswordPbkdf2 } from '../utils'

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

    // qBittorrent stores the Web UI password as salted PBKDF2, not a bare
    // hash. Persist only that derived value (never the plaintext). Writing it
    // to the store flips the value main.ts reads reactively, which restarts
    // the service; main.ts then writes the hash into qBittorrent.conf before
    // the daemon launches (doing it here, while the app runs, would be lost to
    // qBittorrent's on-shutdown config rewrite). The plaintext is returned to
    // the user below and nowhere else.
    const passwordPbkdf2 = qbPasswordPbkdf2(adminPassword)
    await storeJson.merge(effects, { adminPasswordHash: passwordPbkdf2 })

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
