import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

export const setAdminPassword = sdk.Action.withoutInput(
  'set-admin-password',
  async () => ({
    name: i18n('Set Admin Password'),
    description: i18n(
      'Generate a new random admin password for qBittorrent. Applies the new password via the web API.',
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

    await storeJson.merge(effects, { adminPassword })

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
