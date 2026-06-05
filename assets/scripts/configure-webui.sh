#!/bin/sh
# Prepare qBittorrent.conf, then hand off to the image's real entrypoint.
#
# This runs INSIDE the container (as PID 1, before s6-overlay), so it writes
# the config with the right path and ownership — the StartOS host/service
# context cannot write into /config/qBittorrent, which the container owns as
# PUID. Writing here, before qBittorrent starts, also avoids qBittorrent's
# on-shutdown config rewrite clobbering our changes.
#
# - On first boot (no config) it seeds a COMPLETE config: qBittorrent preserves
#   an existing file and won't re-derive defaults, so a partial seed would leave
#   the save path at /config/Downloads and the listen port randomized.
# - The WebUI flags make logins work behind the StartOS reverse proxy
#   (HostHeaderValidation/CSRF) and always require the password (LocalHostAuth).
# - The admin password (qBittorrent PBKDF2, already framed) arrives via the
#   QBT_PW_HASH env var, set by main.ts from the store; empty until the user
#   runs the "Set Admin Password" action.
# - The save path arrives via QBT_SAVE_PATH (set by main.ts from the "Set
#   Download Location" action): /downloads for local storage, or
#   /mnt/filebrowser/<subfolder> when downloads are routed into File Browser.
#   It is upserted on every boot so switching location takes effect, and the
#   directory is created + chowned to PUID:PGID so qBittorrent can write it and
#   File Browser (which runs as the same uid 1000) can read it.
# - It clears qBittorrent's stale single-instance lock (see below) so the Web
#   UI can never get stuck in an invisible crash loop after an unclean stop.
# - It forwards qBittorrent's own log file to stdout so the service's runtime
#   logs are visible in `start-cli package logs` (qbittorrent-nox otherwise
#   only writes to a file, leaving the StartOS log silent).
#
# The peer port (6881) here must match `peerPort` in startos/utils.ts.
set -e

CONF=/config/qBittorrent/qBittorrent.conf
mkdir -p /config/qBittorrent

# Resolve the save path; strip any trailing slash so we can re-append cleanly.
SAVE="${QBT_SAVE_PATH:-/downloads}"
SAVE="${SAVE%/}"
PUID="${PUID:-1000}"
PGID="${PGID:-1000}"

# Ensure the download dirs exist and are owned by the qBittorrent runtime user.
# (This script runs as root before s6 drops to PUID:PGID.) Non-recursive so we
# never rewrite ownership of a large pre-existing download tree.
mkdir -p "$SAVE" "$SAVE/incomplete"
chown "$PUID:$PGID" "$SAVE" "$SAVE/incomplete" 2>/dev/null || true

if [ ! -f "$CONF" ]; then
  cat > "$CONF" <<'QBT_SEED_EOF'
[BitTorrent]
Session\DefaultSavePath=/downloads/
Session\Port=6881
Session\TempPath=/downloads/incomplete/

[LegalNotice]
Accepted=true

[Preferences]
Connection\PortRangeMin=6881
Downloads\SavePath=/downloads/
Downloads\TempPath=/downloads/incomplete/
WebUI\Address=*
WebUI\ServerDomains=*
QBT_SEED_EOF
fi

# Upsert `key=value` into a named `[Section]`, preserving everything else.
# Section, key, and value are passed through the environment (not awk -v) so
# backslashes and the base64/@ByteArray password value are taken literally.
upsert() {
  QBT_S="$1" QBT_K="$2" QBT_V="$3" awk '
    function emit(){ print ENVIRON["QBT_K"] "=" ENVIRON["QBT_V"]; done=1 }
    BEGIN{ done=0; ins=0; sec="[" ENVIRON["QBT_S"] "]" }
    $0==sec{ print; ins=1; next }
    /^\[/{ if(ins && !done) emit(); ins=0; print; next }
    { k=ENVIRON["QBT_K"]
      if(ins && substr($0,1,length(k)+1)==k"="){ if(!done) emit(); next }
      print }
    END{ if(!done){ if(!ins) print sec; emit() } }
  ' "$CONF" > "$CONF.tmp" && mv "$CONF.tmp" "$CONF"
}

# Reverse-proxy compatibility + always-require-password.
upsert Preferences 'WebUI\HostHeaderValidation' 'false'
upsert Preferences 'WebUI\CSRFProtection' 'false'
upsert Preferences 'WebUI\LocalHostAuth' 'false'

# Download location (authoritative key lives in [BitTorrent]; the [Preferences]
# keys are kept in sync for the WebUI display).
upsert BitTorrent 'Session\DefaultSavePath' "$SAVE/"
upsert BitTorrent 'Session\TempPath' "$SAVE/incomplete/"
upsert Preferences 'Downloads\SavePath' "$SAVE/"
upsert Preferences 'Downloads\TempPath' "$SAVE/incomplete/"

if [ -n "$QBT_PW_HASH" ]; then
  upsert Preferences 'WebUI\Password_PBKDF2' "\"$QBT_PW_HASH\""
fi

# Clear qBittorrent's stale single-instance guard. qbittorrent-nox writes a Qt
# QLockFile (/config/qBittorrent/lockfile) plus an ipc-socket to enforce one
# instance per profile, and removes them on a CLEAN exit. When StartOS stops
# the service it SIGKILLs the container, so they survive. On the next boot the
# container's PID namespace resets and qbittorrent-nox reclaims the very same
# low PID the stale lock recorded, so QLockFile's "is the owner still alive?"
# check sees a live process and concludes another instance is running — every
# new instance then quits immediately (exit 0) before binding the Web UI port.
# The result is a silent crash loop: the health check reports "web interface is
# not ready" forever while qbittorrent-nox restarts ~once a second.
#
# StartOS already guarantees a single instance per subcontainer, and no
# qBittorrent is running yet at this point in boot, so any lock present here is
# by definition stale. Drop both artifacts; qBittorrent recreates them.
rm -f /config/qBittorrent/lockfile /config/qBittorrent/ipc-socket

# Surface qBittorrent's runtime log in `start-cli package logs`. qbittorrent-nox
# logs only to /config/qBittorrent/logs/qbittorrent.log, never to stdout, so
# after the image's init banner the container's stdout goes silent and StartOS
# can't show qBittorrent's own diagnostics. Tail the file to stdout in the
# background before handing off: -F follows across qBittorrent's log rotation
# and retries until the file first appears; -n 0 starts at the end so we don't
# replay the whole history on every restart. The tail is reparented to s6
# (PID 1) across the exec below and keeps streaming for the life of the boot.
mkdir -p /config/qBittorrent/logs
tail -n 0 -F /config/qBittorrent/logs/qbittorrent.log &

exec /init
