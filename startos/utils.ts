import { pbkdf2Sync, randomBytes } from 'node:crypto'

// Shared constants for the qBittorrent package
export const uiPort = 8080
export const peerPort = 6881

// Path of qBittorrent's config file, relative to the `main` volume root.
// The volume is mounted into the container at `/config`, so inside the
// container this lives at `/config/qBittorrent/qBittorrent.conf`.
// Verified against linuxserver/qbittorrent:5.2.1.
export const confSubpath = 'config/qBittorrent/qBittorrent.conf'

// Seed config written on first boot, before qBittorrent has created its own.
// It must be COMPLETE enough to carry the defaults we depend on: if a config
// file already exists qBittorrent preserves it and does NOT re-derive these,
// so a partial seed would leave the save path at /config/Downloads and the
// listen port randomized. The `WebUI\*` flags make logins work behind the
// StartOS reverse proxy (HostHeaderValidation/CSRF) and always require the
// password (LocalHostAuth). Verified against linuxserver/qbittorrent:5.2.1:
// seeding this yields save_path=/downloads, listen_port=6881, and a Web UI
// that loads through a mismatched Host header.
export const defaultConf = `[BitTorrent]
Session\\DefaultSavePath=/downloads/
Session\\Port=${peerPort}
Session\\TempPath=/downloads/incomplete/

[LegalNotice]
Accepted=true

[Preferences]
Connection\\PortRangeMin=${peerPort}
Downloads\\SavePath=/downloads/
Downloads\\TempPath=/downloads/incomplete/
WebUI\\Address=*
WebUI\\CSRFProtection=false
WebUI\\HostHeaderValidation=false
WebUI\\LocalHostAuth=false
WebUI\\ServerDomains=*
`

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

/**
 * Upsert `Key=Value` entries into the `[Preferences]` section of a
 * qBittorrent.conf, preserving everything else. Used to set the Web UI
 * password and the reverse-proxy-compatibility flags without disturbing the
 * defaults qBittorrent writes on first run.
 */
export function upsertPreferences(
  conf: string,
  entries: Record<string, string>,
): string {
  const lines = conf.length ? conf.split('\n') : []

  if (!lines.some((l) => l.trim() === '[Preferences]')) {
    if (lines.length && lines[lines.length - 1].trim() !== '') lines.push('')
    lines.push('[Preferences]')
  }

  for (const [key, value] of Object.entries(entries)) {
    const newLine = `${key}=${value}`
    const idx = lines.findIndex((l) => l.startsWith(`${key}=`))
    if (idx >= 0) {
      lines[idx] = newLine
    } else {
      const prefIdx = lines.findIndex((l) => l.trim() === '[Preferences]')
      lines.splice(prefIdx + 1, 0, newLine)
    }
  }

  return lines.join('\n').replace(/\n*$/, '\n')
}
