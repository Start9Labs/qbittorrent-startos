import { manifest as filebrowserManifest } from 'filebrowser-startos/startos/manifest'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { filebrowserMountpoint, uiPort } from './utils'

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

  // Where downloads are saved (set via the "Set Download Location" action).
  // Read reactively so switching target restarts the service and re-mounts.
  const downloadTarget = await storeJson
    .read((s) => s.downloadTarget)
    .const(effects)
  const filebrowserSubpath = await storeJson
    .read((s) => s.filebrowserSubpath)
    .const(effects)

  let mounts = sdk.Mounts.of()
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
    })

  // The save path handed to qBittorrent. Local downloads stay on this
  // service's own volume; File Browser downloads go into a subfolder of File
  // Browser's data volume, mounted read-write here. File Browser serves that
  // volume as uid 1000 — the same uid qBittorrent's PUID drops to — so files
  // qBittorrent writes are immediately readable and browsable there.
  let savePath = '/downloads'
  if (downloadTarget === 'filebrowser') {
    const subfolder =
      (filebrowserSubpath ?? 'qbittorrent').replace(/^\/+|\/+$/g, '') ||
      'qbittorrent'
    savePath = `${filebrowserMountpoint}/${subfolder}`
    mounts = mounts.mountDependency<typeof filebrowserManifest>({
      dependencyId: 'filebrowser',
      volumeId: 'data',
      subpath: null,
      mountpoint: filebrowserMountpoint,
      readonly: false,
    })
  }

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'qbittorrent' },
      mounts,
      'qbittorrent-sub',
    ),
    exec: {
      // Configure qBittorrent.conf in-container, then `exec /init` (the
      // image's s6-overlay entrypoint). runAsInit keeps s6 as PID 1.
      command: ['sh', '/assets/scripts/configure-webui.sh'],
      runAsInit: true,
      // linuxserver images drop privileges to PUID:PGID and set TZ;
      // WEBUI_PORT pins the WebUI port to match the interface + health check;
      // QBT_PW_HASH carries the admin password hash (empty until set);
      // QBT_SAVE_PATH is the resolved download directory inside the container.
      env: {
        PUID: '1000',
        PGID: '1000',
        TZ: 'Etc/UTC',
        WEBUI_PORT: String(uiPort),
        QBT_PW_HASH: passwordHash ?? '',
        QBT_SAVE_PATH: savePath,
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
