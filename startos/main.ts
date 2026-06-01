import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting qBittorrent!'))

  // Read the password hash reactively, so changing it (via the "Set Admin
  // Password" action) restarts the service automatically. It is passed to the
  // configure script (assets/scripts/configure-webui.sh) via QBT_PW_HASH; that
  // script writes it — and the reverse-proxy flags — into qBittorrent.conf
  // from INSIDE the container, before qBittorrent starts. (Writing the config
  // from this host/service context fails: /config/qBittorrent is owned by the
  // container's PUID, which the service context can't write.)
  const passwordHash = await storeJson
    .read((s) => s.adminPasswordHash)
    .const(effects)

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'qbittorrent' },
      sdk.Mounts.of()
        // App config (qBittorrent.conf, categories, RSS, logs, …)
        .mountVolume({
          volumeId: 'main',
          subpath: 'config',
          mountpoint: '/config',
          readonly: false,
        })
        // Downloaded content + incomplete files. The image's default save
        // path is `/downloads/`; without this mount, downloads land on the
        // container's ephemeral filesystem and are lost on every restart.
        .mountVolume({
          volumeId: 'main',
          subpath: 'downloads',
          mountpoint: '/downloads',
          readonly: false,
        })
        // The configure-then-launch wrapper script.
        .mountAssets({
          subpath: null,
          mountpoint: '/assets',
          type: 'directory',
        }),
      'qbittorrent-sub',
    ),
    exec: {
      // Configure qBittorrent.conf in-container, then `exec /init` (the
      // image's s6-overlay entrypoint). runAsInit keeps s6 as PID 1.
      command: ['sh', '/assets/scripts/configure-webui.sh'],
      runAsInit: true,
      // linuxserver images drop privileges to PUID:PGID and set TZ;
      // QBT_PW_HASH carries the admin password hash (empty until set).
      env: {
        PUID: '1000',
        PGID: '1000',
        TZ: 'Etc/UTC',
        QBT_PW_HASH: passwordHash ?? '',
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})
