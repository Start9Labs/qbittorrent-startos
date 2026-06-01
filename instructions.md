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

## Important Notes

- **Peer connectivity**: The TCP peer port (6881) is exposed so remote peers can connect to you. To accept peers from the public internet, forward port `6881` on your router to your StartOS server. UPnP/NAT-PMP is disabled.
- **Downloads location**: Downloaded files are stored under `/downloads` on the `main` volume and are included in backups.
- **Credentials**: The admin password is generated via the "Set Admin Password" action. Only qBittorrent's PBKDF2 hash is stored on disk — the plaintext is shown only once, in the action result. If you lose it, just run the action again to set a new one.
