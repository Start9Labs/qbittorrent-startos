<p align="center">
  <img src="icon.svg" alt="qBittorrent Logo" width="21%">
</p>

# qBittorrent on StartOS

> Everything not listed in this document should behave the same as upstream
> qBittorrent. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[qBittorrent](https://github.com/qbittorrent/qBittorrent) is a BitTorrent client with a web interface. This package generates the Web UI password rather than shipping a default, makes logins work behind StartOS's reverse proxy, and can save downloads straight into File Browser so they are browsable from another service.

- **Upstream repo:** <https://github.com/qbittorrent/qBittorrent>
- **Wrapper repo:** <https://github.com/Start9Labs/qbittorrent-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The LinuxServer image, unmodified, but not started directly.

| Property      | Value                                                    |
| ------------- | -------------------------------------------------------- |
| Image         | `linuxserver/qbittorrent`                                |
| Architectures | x86_64, aarch64                                          |
| Command       | A wrapper script, which then `exec`s the image's `/init` |

| Subcontainer      | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `qbittorrent-sub` | The `primary` daemon — the one to `attach` to |

**The wrapper script is where all of this package's configuration happens**, and it runs inside the container as PID 1 before s6-overlay takes over. It has to: `/config/qBittorrent` is owned by the container's `PUID`, which the service context cannot write to, and qBittorrent rewrites its own config on shutdown, so anything written while it runs is lost. `runAsInit` keeps s6 as PID 1 after the handoff.

What the script does on every boot, in order:

- **Seeds a complete config on a first boot.** qBittorrent preserves an existing config file rather than re-deriving defaults, so a partial seed would leave the save path and listen port wrong forever.
- **Upserts the settings this package owns** into the existing file — the reverse-proxy flags, the save paths, and the password hash — preserving everything you have changed in the Web UI.
- **Creates and chowns the download directories** to the runtime user, non-recursively so a large existing download tree is never re-owned.
- **Clears qBittorrent's stale single-instance lock.** See [Health Checks](#health-checks) — this one is worth understanding.
- **Tails qBittorrent's log file to stdout**, because `qbittorrent-nox` writes only to a file and the service log would otherwise go silent after the image's banner.

Three settings are upserted for the reverse proxy and are not yours to change: host-header validation and CSRF protection are off, because StartOS's proxy rewrites the headers they check, and localhost auth is off so the password is always required.

## Volume and Data Layout

One volume, mounted twice at different subpaths.

| Volume | Mount Point                      | Purpose                                                           |
| ------ | -------------------------------- | ----------------------------------------------------------------- |
| `main` | its `config/` at `/config`       | `qBittorrent.conf`, categories, RSS feeds, logs, and `store.json` |
| `main` | its `downloads/` at `/downloads` | Downloaded content and incomplete files, when saving locally      |

The downloads mount matters more than it looks: the image's default save path is `/downloads`, and without a volume there the content would land on the container's ephemeral filesystem and vanish on every restart.

When downloads are routed to File Browser, its data volume is additionally mounted **read-write** at `/mnt/filebrowser`, and the local `downloads/` subpath sits unused.

## File Models

One model, and it is not qBittorrent's config — that file is written by the wrapper script inside the container, not by a file model.

| File         | Format | Modelled                | Written by      |
| ------------ | ------ | ----------------------- | --------------- |
| `store.json` | JSON   | Yes — `FileHelper.json` | The two actions |

| Key                  | Set by                | Notes                                                     |
| -------------------- | --------------------- | --------------------------------------------------------- |
| `adminPasswordHash`  | Set Admin Password    | The PBKDF2 value only — **the plaintext is never stored** |
| `downloadTarget`     | Set Download Location | `local` or `filebrowser`                                  |
| `filebrowserSubpath` | Set Download Location | Kept across a switch back to local, so it reappears       |

All three are read reactively, so writing any of them restarts the service — which is exactly what applies the change, since the wrapper script only runs at boot.

**The password is stored the way qBittorrent stores it, not as a hash of convenience.** qBittorrent 4.2+ expects PBKDF2-HMAC-SHA512 with a random salt, 100,000 iterations, and a 64-byte key, framed as `@ByteArray(<salt>:<key>)`. A plain hash written to the older key is silently ignored — the login just fails with no error.

**`qBittorrent.conf` is yours** apart from the keys listed above. Change anything else in the Web UI and it survives, because the script upserts rather than rewrites.

## Dependencies

One, optional, and only while it is the chosen download target.

| Dependency    | Kind     | Required                              |
| ------------- | -------- | ------------------------------------- |
| `filebrowser` | `exists` | Only while downloads are routed there |

qBittorrent writes into File Browser's volume whether or not File Browser is running, so it only needs to be installed for the volume to exist. Declaring it this way drives the "File Browser isn't installed" warning without ever blocking qBittorrent's own startup.

**The two services agree on a uid.** File Browser serves its volume as uid 1000, which is the same uid qBittorrent's `PUID` drops to, so files qBittorrent writes there are immediately readable and manageable in File Browser with no permission work.

## Network Access and Interfaces

Two interfaces, and they exist for opposite reasons.

| Interface        | Id     | Type | Port | Masked | Description                         |
| ---------------- | ------ | ---- | ---- | ------ | ----------------------------------- |
| Web UI           | `ui`   | ui   | 8080 | No     | The qBittorrent web interface       |
| BitTorrent Peers | `peer` | p2p  | 6881 | Yes    | Inbound BitTorrent peer connections |

**The peer port is raw TCP and is masked**, since there is nothing for a person to open. Without it qBittorrent can still make outbound connections, but no remote peer can connect in — which usually means noticeably worse performance on a swarm.

**The peer port is duplicated in two places.** The interface declaration and the config the wrapper script seeds must agree, or qBittorrent listens somewhere StartOS is not publishing.

## Installation and First-Run Flow

Install starts the service and raises a `critical` task: set the admin password. **The Web UI is unusable until you do** — the package ships no default credential, and the config carries an empty password.

Running that action generates a 32-character password, shows it once, and restarts the service so the wrapper script writes it into the config. The username is always `admin`.

Downloads go to this service's own volume unless you say otherwise. If you would rather browse and manage them elsewhere, install File Browser and run Set Download Location.

## Actions

Two actions, both available whether or not the service is running, and both applied by the restart they trigger.

### Set Admin Password / Reset Admin Password

One action whose name flips once a password exists.

- **What it changes:** `adminPasswordHash` in `store.json`; the wrapper script writes it into `qBittorrent.conf` on the next boot.
- **Cost:** seconds, then a restart.
- **Repeat safety:** safe to re-run; each run generates a fresh password and invalidates the previous one.
- **Outputs:** the username and password, masked and copyable. **The plaintext is shown once and stored nowhere** — running the action again is the only recovery.

### Set Download Location

Local storage, or a subfolder inside File Browser.

- **What it changes:** `downloadTarget` and `filebrowserSubpath` in `store.json`; through them the container's mounts, the save path, and the package's dependency.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent. Switching back to local leaves the stored subfolder alone, so it reappears if you switch back again.
- **Existing downloads do not move.** The new path applies to what qBittorrent saves from then on; files already on the old path stay there, and torrents still seeding from it keep pointing at it.
- **The subfolder is created automatically**, and chowned so both services can use it.

## Tasks

One task, and it can come back.

| Task               | Severity   | Raised when                      | Cleared when    |
| ------------------ | ---------- | -------------------------------- | --------------- |
| Set Admin Password | `critical` | Whenever no password hash is set | The action runs |

Checked on every init, not just at install — clearing the hash brings the task back. `critical` because there is no default credential: without it the Web UI cannot be signed into at all.

## Health Checks

One check, on the only daemon.

| Check     | Displayed       | Method                 |
| --------- | --------------- | ---------------------- |
| `primary` | "Web Interface" | Port 8080 is listening |

qBittorrent binds quickly, so a failure means it did not start. One cause is worth knowing because it presents as nothing at all:

**The stale-lock crash loop.** `qbittorrent-nox` writes a Qt lock file and an IPC socket to enforce one instance per profile, and removes them only on a clean exit. StartOS stops a service by SIGKILLing the container, so they survive. On the next boot the container's PID namespace resets and `qbittorrent-nox` reclaims the very same low PID the stale lock recorded — so the "is the owner still alive?" check sees a live process, concludes another instance is running, and **quits immediately with exit code 0** before binding the port. The result is a silent loop: the health check says "not ready" forever while the process restarts about once a second, with no error anywhere.

The wrapper script deletes both artifacts on every boot, which is safe because StartOS already guarantees one instance per subcontainer and nothing is running at that point.

Because the script also tails qBittorrent's own log to stdout, the service log carries its real diagnostics rather than going quiet after the image's banner.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. No dump step and nothing excluded.

- **Included:** `qBittorrent.conf` with the password hash and every Web UI setting, the torrent state, categories, RSS feeds, logs, `store.json`, **and every locally-saved download**.
- **Size:** with local downloads, this backup is as large as your download directory. Routing downloads to File Browser moves that bulk into File Browser's backup instead — those files are outside this volume and are never captured here.
- **Restore:** complete, and no task is raised — the password comes back with the store. Torrents resume against whatever save path is configured.

## Limitations and Differences

1. **No default credential.** The Web UI is unusable until the password action is run, and the password is shown once.
2. **Host-header validation and CSRF protection are disabled**, because StartOS's reverse proxy rewrites what they check. Localhost auth is disabled too, so a password is always required.
3. **qBittorrent's config is written from inside the container at boot.** A change made in the Web UI to one of the package-owned keys is overwritten on the next restart.
4. **Changing the download location does not move existing files.**
5. **Downloads routed to File Browser are not in this service's backup.**
6. **The peer port is masked** and is not meant to be opened in a browser.
7. **No riscv64 build.** x86_64 and aarch64 only.

---

## Quick Reference for AI Consumers

```yaml
package_id: qbittorrent
image: linuxserver/qbittorrent
architectures:
  - x86_64
  - aarch64
subcontainers:
  - qbittorrent-sub # the only container
volumes:
  main: its config/ at /config, its downloads/ at /downloads
file_models:
  - store.json # qBittorrent.conf is written by the wrapper script, not modelled
startos_managed_env_vars:
  - PUID
  - PGID
  - TZ
  - WEBUI_PORT
  - QBT_PW_HASH # the PBKDF2 value; empty until the password action runs
  - QBT_SAVE_PATH # resolved from the download-location action
dependencies:
  - filebrowser # optional, exists; only while it is the download target
interfaces:
  ui: { type: ui, port: 8080 }
  peer: { type: p2p, port: 6881 } # masked; raw TCP
actions:
  - set-admin-password # name flips Set/Reset
  - set-download-location
tasks:
  - { action: set-admin-password, severity: critical } # re-raises whenever unset
health_checks:
  - primary # displayed "Web Interface"
```
