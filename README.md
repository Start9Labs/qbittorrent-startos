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
| Command       | Uses Dockerfile entrypoint (s6-overlay)            |

---

## Volume and Data Layout

| Volume | Mount Point | Purpose                          |
| ------ | ----------- | -------------------------------- |
| `main` | `/config`   | Config, downloads, and torrents  |

qBittorrent stores:
- **Configuration**: `/config/qBittorrent/qBittorrent/qBittorrent.conf`
- **Downloads**: `/downloads/` (within the container; maps to `/config` on the volume)

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

The web UI admin password is managed via the **"Set Admin Password"** action in StartOS.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose                     |
| --------- | ---- | -------- | ------------------------- |
| Web UI    | 8080 | HTTP     | Web interface for management |
| Peer      | 6881 | TCP/UDP  | BitTorrent peer connections |

**Access methods:**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

**Note:** BitTorrent peer connections on port 6881 use raw TCP/UDP and are not exposed through StartOS interfaces. Users may need to forward this port on their router for optimal peer connectivity.

---

## Actions (StartOS UI)

| Action | Description                                    |
| ------ | ------------------------------------------------ |
| Set Admin Password | Generate a new random web UI admin password. The service restarts automatically to apply it |

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

None.

---

## Limitations and Differences

1. **No automatic port forwarding** — qBittorrent's UPnP/NAT-PMP functionality may not work correctly in StartOS networking. Manual port forwarding may be required.
2. **Download directory** — By default, downloads are stored on the `main` volume. Users should configure the download directory through the web UI to match their desired path.
3. **Peer connectivity** — For optimal torrent speeds, users should forward port 6881 (TCP/UDP) on their router.
4. **Admin password** — Managed via the **"Set Admin Password"** action. Only the SHA-256 hash is stored on disk; plaintext is shown only at generation time.

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
volumes:
  main: /config
ports:
  ui: 8080
  peer: 6881
dependencies: none
startos_managed_env_vars: none
credential_flow: >
  SHA-256 hash only in store.json + qBittorrent.conf.
  Plaintext shown only in action result at generation time.
  Critical task on install prompts user to run "Set Admin Password".
  Service restarts automatically via const reactivity on password change.
runAsInit: true  # s6-overlay requires PID 1
actions:
  - setAdminPassword
```
