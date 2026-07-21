# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `qbittorrent`.** Two interfaces: `ui` (Web UI over HTTP, port 8080) and `peer` (raw-TCP BitTorrent peer port 6881). The Web UI admin password is app-native — only the qBittorrent PBKDF2 hash is persisted (in `store.json`) and injected via `QBT_PW_HASH`; the "Set Admin Password" action rotates it and a restart re-writes it into `qBittorrent.conf`.
- **File Browser is an optional dependency.** The "Set Download Location" action can point downloads into File Browser's data volume (mounted read-write at `/mnt/filebrowser`); the dependency is only declared/required while that target is selected.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach qbittorrent -n qbittorrent -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `qbittorrent-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
