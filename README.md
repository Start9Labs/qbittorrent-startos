<p align="center">
  <img src="icon.svg" alt="qBittorrent Logo" width="21%">
</p>

# qBittorrent on StartOS

> **Upstream repo:** <https://github.com/qbittorrent/qBittorrent>

qBittorrent is a free and open-source BitTorrent client. The StartOS package provides a web UI for managing torrents, configuring settings, and monitoring downloads.

## Getting Started

See [instructions.md](instructions.md) for setup instructions.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                              |
| ------------- | -------------------------------------------------- |
| Image         | `linuxserver/qbittorrent:5.2.1`                     |
| Architectures | x86_64, aarch64                                    |
| Command       | `configure-webui.sh` (writes `qBittorrent.conf`) then `exec /init` (s6-overlay), PID 1 via `runAsInit` |
| Env           | `PUID=1000`, `PGID=1000`, `TZ=Etc/UTC`, `WEBUI_PORT=8080` |

---

## Volume and Data Layout

A single `main` volume holds both config and downloads, mounted into the container at two paths:

| Mount Point  | Volume subpath      | Purpose                                  |
| ------------ | ------------------- | ---------------------------------------- |
| `/config`    | `main/config`       | `qBittorrent.conf`, categories, RSS, logs |
| `/downloads` | `main/downloads`    | Completed and in-progress downloads       |

qBittorrent stores:
- **Configuration**: `/config/qBittorrent/qBittorrent.conf`
- **Downloads**: `/downloads/` (and `/downloads/incomplete/`), persisted on the `main` volume

> Both paths must be mounted — qBittorrent's default save path is `/downloads/`, which is a separate location from `/config`. Both are included in backups.

---

## Installation and First-Run Flow

1. Install the package and start the service.
2. A **critical task** prompts you to run the **"Set Admin Password"** action.
3. Run the action — it generates a random password and displays the credentials.
4. Access the web UI via the StartOS interface link and log in.

---

## Configuration Management

All configuration is managed through the qBittorrent web UI. Key settings include:

- **Download/Complete Directories**: configurable via the web UI
- **Connection Limits**: configurable via the web UI
- **Bandwidth Limits**: configurable via the web UI
- **DHT/Peering**: enabled by default
- **UPnP/NAT-PMP**: configurable via the web UI

The web UI admin password is managed via the **"Set Admin Password"** action in StartOS (shown as **"Reset Admin Password"** once a password exists). The download location is managed via the **"Set Download Location"** action (see below).

### Download Location (local or File Browser)

By default, qBittorrent saves to its own `main` volume at `/downloads`. The **"Set Download Location"** action lets you instead write completed downloads into **File Browser**, so the files are browsable, downloadable, and manageable from File Browser's UI:

- Pick **File Browser** as the target and choose a subfolder (default `qbittorrent`).
- qBittorrent mounts File Browser's `data` volume read-write at `/mnt/filebrowser` and points its save path at `/mnt/filebrowser/<subfolder>`.
- File Browser runs as uid `1000`, the same uid qBittorrent's `PUID` drops to, so files qBittorrent writes are immediately readable in File Browser with no ownership fix-ups.
- File Browser is an **optional** dependency: qBittorrent runs standalone with local storage, and the dependency only applies while File Browser is the selected target. Install File Browser before selecting it.
- Switching back to **Local storage** repoints the save path to `/downloads` and unmounts File Browser on the next restart.

> Changing the location does not move existing downloads — only new torrents save to the new path. The save path is written into `qBittorrent.conf` in-container on each start (the same mechanism as the admin password), so it survives qBittorrent's on-shutdown config rewrite.

---

## Network Access and Interfaces

| Interface       | Port | Protocol | Type | Purpose                       |
| --------------- | ---- | -------- | ---- | ----------------------------- |
| Web UI          | 8080 | HTTP     | `ui`  | Web interface for management   |
| BitTorrent Peers| 6881 | TCP      | `p2p` | Inbound BitTorrent peer connections |

The Web UI is reachable by the usual StartOS methods (LAN IP, `<hostname>.local`, Tor `.onion`, or a custom domain). The Web UI guards `HostHeaderValidation` and `CSRFProtection` are disabled in `qBittorrent.conf` so logins work through the StartOS reverse proxy; `LocalHostAuth` is disabled so the password is always required.

**Note:** BitTorrent peers are addressed by IP:port, not hostname, so there is no address for qBittorrent to advertise — the public address peers see is whatever the service's **outbound gateway** presents (`System > Gateways`, or per-service via **Actions > Set Outbound Gateway**). The peer interface exposes the listening port (TCP 6881) for inbound connections; reaching it from the public internet requires a gateway that accepts inbound (home router with port `6881` forwarded, or a StartTunnel) — outbound-only VPNs and CGNAT cannot. qBittorrent also uses UDP 6881 for DHT/µTP; only the TCP port is exposed. See [instructions.md](instructions.md) for details.

---

## Actions (StartOS UI)

| Action | Description                                    |
| ------ | ------------------------------------------------ |
| Set Admin Password | Generate a new random web UI admin password. Renamed to **Reset Admin Password** once a password has been set |
| Set Download Location | Choose where completed downloads are saved — local storage or a subfolder inside File Browser |

---

## Backups and Restore

**Included in backup:**

- `main` volume (config, torrent files, downloads)

**Restore behavior:** Volume is fully restored before the service starts. The admin password hash is preserved from the restored store.

---

## Health Checks

| Check         | Method              | Messages                                                           |
| ------------- | ------------------- | ------------------------------------------------------------------ |
| Web Interface | Port listening (8080) | Success: "The web interface is ready" / Error: "The web interface is not ready" |

---

## Dependencies

| Dependency | Optional | Why |
| ---------- | -------- | --- |
| File Browser (`>=2.63.2`) | Yes | Only when **"Set Download Location"** targets File Browser. qBittorrent mounts File Browser's `data` volume read-write and saves downloads there. Declared `kind: 'exists'` — File Browser must be installed (so the volume exists) but need not be running for downloads to land. |

---

## Limitations and Differences

1. **Download directory** — By default downloads persist to `/downloads` on the `main` volume. The **"Set Download Location"** action can instead route them into File Browser's `data` volume (mounted at `/mnt/filebrowser`). Changing the save path in the Web UI to a location outside the mounted paths (`/downloads`, `/config`, or `/mnt/filebrowser` when File Browser is selected) will not persist across restarts, since only those paths are mounted — use the action to change where downloads go.
2. **Peer connectivity** — The TCP peer port (6881) is exposed as a `p2p` interface for inbound connections. The address peers see you at is defined by the service's outbound gateway, not by qBittorrent (BitTorrent has no hostname to advertise). qBittorrent also uses UDP 6881 for DHT/µTP; only the TCP port is exposed. Inbound peering requires an inbound-capable gateway (home router with the port forwarded, or StartTunnel); outbound-only VPNs and CGNAT cannot accept inbound peers. UPnP/NAT-PMP is disabled.
3. **Admin password** — Managed via the **"Set Admin Password"** action. Only qBittorrent's PBKDF2 hash is stored on disk (in `store.json` and `qBittorrent.conf`); the plaintext is shown only in the action result at generation time.

---

## What Is Unchanged from Upstream

The service is identical to upstream qBittorrent. There are no modifications to the application itself.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: qbittorrent
image: linuxserver/qbittorrent:5.2.1
architectures: [x86_64, aarch64]
env: { PUID: 1000, PGID: 1000, TZ: Etc/UTC, WEBUI_PORT: 8080 }
volumes:
  main:
    /config: main/config        # qBittorrent.conf, categories, RSS, logs
    /downloads: main/downloads   # completed + incomplete downloads
interfaces:
  ui: { port: 8080, protocol: http, type: ui }
  peer: { port: 6881, protocol: tcp, type: p2p }   # inbound BitTorrent peers
dependencies:
  filebrowser:                    # optional; only while it is the download target
    versionRange: '>=2.63.2:0'
    kind: exists                  # must be installed (volume exists); need not be running
    volume_mounted: data -> /mnt/filebrowser (read-write)
download_location:                # set via "Set Download Location" action
  store_fields: { downloadTarget: local|filebrowser, filebrowserSubpath: string }
  save_path: local -> /downloads ; filebrowser -> /mnt/filebrowser/<subfolder>
  note: >
    File Browser runs as uid 1000, same as qBittorrent's PUID, so written files
    are readable in File Browser with no chown. The save path is written into
    qBittorrent.conf in-container by configure-webui.sh via QBT_SAVE_PATH.
startos_managed_env_vars: none
credential_flow: >
  Username is always "admin". Action generates a random 32-char password,
  stores ONLY qBittorrent's PBKDF2 hash (@ByteArray salt:key) in store.json,
  and returns the plaintext once in the action result. A critical task on
  install prompts the user to run "Set Admin Password". main.ts passes the hash
  to assets/scripts/configure-webui.sh via the QBT_PW_HASH env var; that script
  writes the hash + reverse-proxy flags into qBittorrent.conf IN-CONTAINER,
  before launching qBittorrent (the host/service context can't write the
  PUID-owned /config/qBittorrent dir, and an in-flight write would be lost to
  qBittorrent's on-shutdown rewrite). The store change restarts the service
  automatically via const reactivity.
webui_conf_flags:                 # set so logins work behind the StartOS proxy
  WebUI\HostHeaderValidation: false
  WebUI\CSRFProtection: false
  WebUI\LocalHostAuth: false
runAsInit: true  # linuxserver s6-overlay requires PID 1
actions:
  - setAdminPassword
  - setDownloadLocation
```
