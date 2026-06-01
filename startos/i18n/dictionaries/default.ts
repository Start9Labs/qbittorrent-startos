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

  // actions/setAdminPassword.ts
  'Set Admin Password': 6,
  'Generate a new random admin password for qBittorrent. Applies the new password via the web API.': 7,
  'Login Credentials': 8,
  'Use these credentials to sign in to the qBittorrent web UI.': 9,
  'Username': 10,
  'Password': 11,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
