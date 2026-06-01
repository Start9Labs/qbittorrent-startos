# qBittorrent Instructions

## Getting Started

1. **Install the package** and start the service.
2. **Set your admin password**:
   - In the StartOS UI, click the **"Set Admin Password"** action.
   - A random password is generated and displayed. The username is always `admin`.
3. **Log in to the web UI**:
   - Access the interface via the StartOS link.
   - Username: `admin`
   - Password: the value shown by the action.
4. **Rotate your password** anytime by running **"Set Admin Password"** again.

## Configuring Downloads

1. Go to **Tools > Options > Directories** to set your download and incomplete files paths.
2. The default download directory is `/downloads/`.
3. You can add custom download folders and configure automatic file management.

## Adding Torrents

- Drag and drop `.torrent` files in the web UI
- Use the "Add Torrent" button to paste a magnet link or upload a file
- Right-click on a torrent to set priority, speed limits, and ratios

## Bandwidth Management

- Go to **Tools > Options > Speed** to set global speed limits
- Right-click on individual torrents to set per-torrent limits
- Use **Options > Scheduler** to set automated schedules

## Important Notes

- **Port forwarding**: For optimal torrent speeds, forward port `6881` (TCP/UDP) on your router to your StartOS server.
- **UPnP**: qBittorrent's UPnP/NAT-PMP may not work in the StartOS networking environment. Use manual port forwarding instead.
- **Downloads location**: All downloaded files are stored on the `main` volume. The backup includes all downloaded content.
- **Credentials**: Admin password is generated via the "Set Admin Password" action. Only the password hash is stored on disk — plaintext is shown only at generation time.
