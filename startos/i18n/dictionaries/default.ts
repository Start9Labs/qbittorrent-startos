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
  'BitTorrent Peers': 13,
  'Inbound BitTorrent peer connections': 14,

  // init/watchAdminPassword.ts
  'Set the admin password before signing in': 6,

  // actions/setAdminPassword.ts
  'Set Admin Password': 7,
  'Reset Admin Password': 23,
  'Generate a new random password for the qBittorrent web UI admin account.': 8,
  'Login Credentials': 9,
  'Use these credentials to sign in to the qBittorrent web UI.': 10,
  Username: 11,
  Password: 12,

  // actions/setDownloadLocation.ts
  'Set Download Location': 15,
  'Choose where qBittorrent saves completed downloads — locally, or into File Browser.': 16,
  'Download Location': 17,
  'Where qBittorrent saves completed downloads. "Local storage" keeps them on this service. "File Browser" writes them into File Browser so you can browse, download, and manage the files there.': 18,
  'Local storage': 19,
  'File Browser': 20,
  'File Browser Subfolder': 21,
  'Folder inside File Browser where downloads are saved. Created automatically; File Browser must be installed.': 22,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
