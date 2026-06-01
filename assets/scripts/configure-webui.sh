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
#
# The peer port (6881) here must match `peerPort` in startos/utils.ts.
set -e

CONF=/config/qBittorrent/qBittorrent.conf
mkdir -p /config/qBittorrent

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

# Upsert `key=value` into the [Preferences] section, preserving everything else.
# Key and value are passed through the environment (not awk -v) so backslashes
# and the base64/@ByteArray password value are taken literally.
upsert() {
  QBT_K="$1" QBT_V="$2" awk '
    function emit(){ print ENVIRON["QBT_K"] "=" ENVIRON["QBT_V"]; done=1 }
    BEGIN{ done=0; inp=0 }
    /^\[Preferences\]/{ print; inp=1; next }
    /^\[/{ if(inp && !done) emit(); inp=0; print; next }
    { k=ENVIRON["QBT_K"]
      if(inp && substr($0,1,length(k)+1)==k"="){ if(!done) emit(); next }
      print }
    END{ if(!done){ if(!inp) print "[Preferences]"; emit() } }
  ' "$CONF" > "$CONF.tmp" && mv "$CONF.tmp" "$CONF"
}

upsert 'WebUI\HostHeaderValidation' 'false'
upsert 'WebUI\CSRFProtection' 'false'
upsert 'WebUI\LocalHostAuth' 'false'
if [ -n "$QBT_PW_HASH" ]; then
  upsert 'WebUI\Password_PBKDF2' "\"$QBT_PW_HASH\""
fi

exec /init
