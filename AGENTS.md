# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **The password is PBKDF2, not a hash.** qBittorrent 4.2+ expects `@ByteArray(<base64 salt>:<base64 key>)` from PBKDF2-HMAC-SHA512, 100k iterations, 64-byte key; a plain hash written to `WebUI\Password` is silently ignored and the login just fails. Store the derived value only, never the plaintext.
- **The first-boot seed must be a complete config.** qBittorrent preserves an existing file rather than re-deriving defaults, so a partial seed permanently leaves the save path and listen port wrong. Later boots upsert instead, which is what preserves settings the user changed in the Web UI.
- **Deleting `lockfile` and `ipc-socket` on every boot is load-bearing.** A SIGKILLed container leaves both behind; the fresh PID namespace hands `qbittorrent-nox` the same low PID the stale lock recorded, so its liveness check passes and every instance exits 0 before binding — a silent crash loop with no error. Safe to delete because StartOS guarantees one instance per subcontainer.
- **`peerPort` in `startos/utils.ts` and the port seeded in `configure-webui.sh` must stay in step.** They are two copies of the same fact, and a mismatch has qBittorrent listening where StartOS is not publishing.
- **The log tail is not cosmetic.** `qbittorrent-nox` writes only to a file, so without it the service log goes silent after the image's banner and there is nothing to diagnose from.
- **`kind: 'exists'` for File Browser is correct** — qBittorrent writes into its volume whether or not it is running. Both run as uid 1000, which is what makes the shared files work without permission handling.
