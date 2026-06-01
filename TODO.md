# TODO

- [x] Randomized admin credentials (PBKDF2 hash-only storage)
- [x] Correct qBittorrent PBKDF2 password format (verified login end-to-end)
- [x] Reverse-proxy compatibility flags (HostHeaderValidation/CSRF/LocalHostAuth)
- [x] Write config from main.ts before daemon start (avoids on-shutdown clobber)
- [x] Critical task for password via watchAdminPassword
- [x] runAsInit for s6-overlay compatibility
- [x] Auto-restart on password change (const reactivity)
- [x] Mount `/downloads` so downloaded content persists
- [x] Expose BitTorrent peer port (TCP 6881) as a p2p interface
- [ ] Add bandwidth limit configuration via actions
- [ ] Verify install on an actual StartOS instance (login + downloads + restart)
- [ ] Verify backup and restore
- [ ] Publish to registry

## Verified locally (docker, linuxserver/qbittorrent:5.2.1)

- Config path is `/config/qBittorrent/qBittorrent.conf` (single nesting).
- PBKDF2-HMAC-SHA512, 100k iters, 16-byte salt, 64-byte key, framed as
  `@ByteArray(b64(salt):b64(key))` → login returns 204 + SID; wrong pw rejected.
- `WebUI\HostHeaderValidation=false` is required or proxied logins 401 with
  "Invalid Host header, port mismatch".
- Writing the config while qBittorrent runs is lost to its on-shutdown rewrite;
  writing before start (as main.ts does) takes effect.

## Not yet verified (needs a real StartOS box)

- That the action/main filesystem context can write the `main` volume's config
  with the right ownership for the PUID:PGID container user.
- p2p peer-port reachability end-to-end through the StartOS proxy.
