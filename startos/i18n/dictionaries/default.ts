export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting qBittorrent!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,
  'Admin password not set. Run "Set Admin Password" action first.': 4,

  // interfaces.ts
  'Web UI': 5,
  'The qBittorrent web interface': 6,

  // init/watchAdminPassword.ts
  'Set the admin password before signing in': 7,

  // actions/setAdminPassword.ts
  'Set Admin Password': 8,
  'Generate a new random password for the qBittorrent web UI admin account. Requires a service restart to take effect.': 9,
  'The service must be restarted for the new password to take effect.': 10,
  'Login Credentials': 11,
  'Use these credentials to sign in to the qBittorrent web UI. Restart the service for the new password to take effect.': 12,
  'Username': 13,
  'Password': 14,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
