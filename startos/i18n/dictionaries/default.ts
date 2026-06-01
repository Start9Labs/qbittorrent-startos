export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting qBittorrent!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,

  // interfaces.ts
  'Web UI': 4,
  'The qBittorrent web interface': 5,

  // init/watchAdminPassword.ts
  'Set the admin password before signing in': 6,

  // actions/setAdminPassword.ts
  'Set Admin Password': 7,
  'Generate a new random password for the qBittorrent web UI admin account. The service restarts automatically to apply it.': 8,
  'Login Credentials': 9,
  'Use these credentials to sign in to the qBittorrent web UI. The service is restarting automatically.': 10,
  'Username': 11,
  'Password': 12,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
