# qBittorrent Instructions

## Documentation

- [qBittorrent Wiki](https://github.com/qbittorrent/qBittorrent/wiki) — official upstream documentation covering the Web UI, configuration options, and features.

## Getting Started

1. **Install the package** and start the service.
2. **Set your admin password**:
   - A critical task will prompt you to run the **"Set Admin Password"** action.
   - Click the action to generate a random password and display your credentials.
   - The username is always `admin`.
3. **Log in to the web UI**:
   - Access the interface via the StartOS link.
   - Username: `admin`
   - Password: the value shown by the action.
4. **Rotate your password** anytime by running **"Reset Admin Password"** (the action is renamed from "Set Admin Password" once a password has been set).

## Configuring Downloads

By default, downloads are saved on qBittorrent's own storage at `/downloads` (incomplete files go to `/downloads/incomplete/`), and are included in backups.

### Saving downloads into File Browser

If you also run **File Browser**, you can have qBittorrent save downloads straight into it, so you can browse, open, and download the finished files from File Browser:

1. Install and start **File Browser** first.
2. Run the **"Set Download Location"** action on qBittorrent.
3. Choose **File Browser** and (optionally) change the subfolder name (default `qbittorrent`).
4. qBittorrent now saves into File Browser. The folder appears in File Browser automatically, and new downloads show up there as they complete.

To go back, run the action again and choose **Local storage**.

Notes:
- Changing the location affects **new** downloads only — it does not move files you already downloaded.
- Inside qBittorrent's own **Tools > Options > Directories**, the save path is managed for you; keep downloads under the active location (`/downloads`, or `/mnt/filebrowser` when File Browser is selected). Paths outside the mounted locations are not stored and will be lost on restart.
- You can still add custom download folders and automatic file management within the active location.

## Adding Torrents

- Drag and drop `.torrent` files in the web UI
- Use the "Add Torrent" button to paste a magnet link or upload a file
- Right-click on a torrent to set priority, speed limits, and ratios

## Bandwidth Management

- Go to **Tools > Options > Speed** to set global speed limits
- Right-click on individual torrents to set per-torrent limits
- Use **Options > Scheduler** to set automated schedules

## Peer Address and Connectivity

BitTorrent peers find each other by **IP address and port**, not by hostname — there is no "address" for qBittorrent to advertise. The public address other peers see you at is whatever your **outbound gateway** presents to the Internet:

- The gateway is set under **System > Gateways** (the default for all services), or per-service under this service's **Actions > Set Outbound Gateway**. If you route qBittorrent through an outbound VPN, peers and trackers see the VPN's IP instead of your home IP.
- The TCP peer port (6881) is exposed so remote peers can connect **in**. For that to work, your chosen gateway must accept inbound connections and the port must be reachable: on a home router, forward port `6881` to your StartOS server; commercial/outbound-only VPNs (and ISPs using CGNAT) cannot accept inbound peers — use a StartTunnel gateway if you need inbound peering through a tunnel. UPnP/NAT-PMP is disabled.
- Without inbound reachability qBittorrent still works — it just can't receive unsolicited peer connections, which can reduce speeds and connectivity for some torrents.

## Important Notes
- **Downloads location**: Downloaded files are stored under `/downloads` on the `main` volume by default (included in backups), or inside **File Browser** if you select it via the "Set Download Location" action.
- **Credentials**: The admin password is generated via the "Set Admin Password" action (renamed "Reset Admin Password" after first use). Only qBittorrent's PBKDF2 hash is stored on disk — the plaintext is shown only once, in the action result. If you lose it, just run the action again to set a new one.
