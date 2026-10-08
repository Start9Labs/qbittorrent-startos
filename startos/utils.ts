import { pbkdf2Sync, randomBytes } from 'node:crypto'
import { i18n } from './i18n'

// Shared constants for the qBittorrent package
export const uiPort = 8080
// Must match the peer port written in assets/scripts/configure-webui.sh
export const peerPort = 6881

// Where NextExplorer's or FileBrowser Quantum's data volume is mounted when it is the download target.
export const nextexplorerMountpoint = '/mnt/nextexplorer'
export const filebrowserMountpoint = '/mnt/filebrowser'

export const subfolderPattern = {
  regex: '(?!/)(?!(?:.*/)?\\.\\.(?:/.*)?$).+',
  description: i18n('Cannot start with a slash or contain a .. folder'),
}

/**
 * Compute the value qBittorrent stores in `WebUI\Password_PBKDF2`.
 *
 * qBittorrent 4.2+ stores the Web UI password as PBKDF2-HMAC-SHA512 with a
 * 16-byte random salt, 100 000 iterations, and a 64-byte derived key, framed
 * as `@ByteArray(<base64 salt>:<base64 key>)`. This is NOT a bare hash — a
 * plain SHA-256 written to `WebUI\Password` is silently ignored. Format and
 * round-trip login verified against linuxserver/qbittorrent:5.2.1.
 */
export function qbPasswordPbkdf2(password: string): string {
  const salt = randomBytes(16)
  const key = pbkdf2Sync(password, salt, 100_000, 64, 'sha512')
  return `@ByteArray(${salt.toString('base64')}:${key.toString('base64')})`
}
