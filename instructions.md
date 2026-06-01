# qBittorrent Instructions

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
4. **Rotate your password** anytime by running **"Set Admin Password"** again. The service restarts automatically and the new password takes effect.

## Configuring Downloads

1. Go to **Tools > Options > Directories** to set your download and incomplete files paths.
2. The default download directory is `/downloads/` (incomplete files go to `/downloads/incomplete/`). Keep your save paths under `/downloads` so they persist and are included in backups — paths outside `/downloads` and `/config` are not stored and will be lost on restart.
3. You can add custom download folders and configure automatic file management.

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
- **Downloads location**: Downloaded files are stored under `/downloads` on the `main` volume and are included in backups.
- **Credentials**: The admin password is generated via the "Set Admin Password" action. Only qBittorrent's PBKDF2 hash is stored on disk — the plaintext is shown only once, in the action result. If you lose it, just run the action again to set a new one.
