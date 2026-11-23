import { manifest as filebrowserManifest } from 'filebrowser-quantum-startos/startos/manifest'
import { manifest as nextexplorerManifest } from 'nextexplorer-startos/startos/manifest'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import {
  filebrowserMountpoint,
  nextexplorerMountpoint,
  peerHostId,
  peerPort,
  resolveSharedDownloadPath,
  resolveSharedVolumeTarget,
  sharedVolumeMountpoint,
  uiPort,
} from './utils'

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
  const apiKey = await storeJson.read((s) => s.apiKey).const(effects)
  const announcePort = await sdk.host
    .getOwn(
      effects,
      peerHostId,
      (host) => host?.bindings[peerPort]?.net.assignedPort,
    )
    .const()
  if (announcePort == null) {
    throw new Error('The BitTorrent peer binding has no assigned port')
  }

  // Where downloads are saved (set via the "Set Download Location" action).
  // Read reactively so switching target restarts the service and re-mounts.
  const downloadTarget = await storeJson
    .read((s) => s.downloadTarget)
    .const(effects)
  const sharedDownloadPath = await storeJson
    .read(resolveSharedDownloadPath)
    .const(effects)
  const volumeTarget = await storeJson
    .read(resolveSharedVolumeTarget)
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
  // service's own volume; shared-volume downloads go into a subfolder of the
  // chosen volume, mounted below; FileBrowser Quantum downloads go into a subfolder of
  // FileBrowser Quantum's data volume, mounted read-write here. FileBrowser
  // Quantum serves that volume as uid 1000 — the same uid qBittorrent's PUID
  // drops to — so files qBittorrent writes are immediately readable and
  // browsable there.
  const savePath = volumeTarget
    ? `${sharedVolumeMountpoint}/${volumeTarget.subpath}`
    : (sharedDownloadPath ?? '/downloads')
  if (downloadTarget === 'nextexplorer') {
    mounts = mounts.mountDependency<typeof nextexplorerManifest>({
      dependencyId: 'nextexplorer',
      volumeId: 'data',
      subpath: null,
      mountpoint: nextexplorerMountpoint,
      readonly: false,
    })
  }
  if (downloadTarget === 'filebrowser') {
    mounts = mounts.mountDependency<typeof filebrowserManifest>({
      dependencyId: 'filebrowser',
      volumeId: 'data',
      subpath: null,
      mountpoint: filebrowserMountpoint,
      readonly: false,
    })
  }

  const subcontainer = sdk.SubContainer.of(
    effects,
    { imageId: 'qbittorrent' },
    mounts,
    'qbittorrent-sub',
  )

  // A shared volume is the user's, and can be revoked, switched to read-only or
  // go offline. Without it qBittorrent has nowhere to save, so it is not
  // started at all rather than left to fail every torrent. The grants are read
  // only for this target, so they restart the service only when it uses one.
  if (downloadTarget === 'volume') {
    const grant = (await sdk.getSharedVolumes(effects).const()).find(
      (volume) => volume.id === volumeTarget?.id,
    )
    const problem = !grant
      ? i18n(
          'qBittorrent no longer has access to the shared volume chosen for downloads, so it is not running. Give it access again in StartOS, or run Set Download Location to choose another place.',
        )
      : grant.readonly
        ? i18n(
            'qBittorrent has read-only access to ${name}, so it is not running. Change the access to read/write in StartOS, or run Set Download Location to choose another place.',
            { name: grant.name },
          )
        : (
              await subcontainer.tryMountSharedVolume({
                id: grant.id,
                mountpoint: sharedVolumeMountpoint,
                readonly: false,
              })
            ).kind === 'unavailable'
          ? i18n(
              '${name} is not available, so qBittorrent is not running. It starts once the volume is available again.',
              { name: grant.name },
            )
          : null
    if (problem) {
      return sdk.Daemons.of(effects).addHealthCheck('download-location', {
        ready: {
          display: i18n('Download Location'),
          gracePeriod: 0,
          trigger: async function* () {
            yield
          },
          fn: () => ({ result: 'failure', message: problem }),
        },
        requires: [],
      })
    }
  }

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer,
    exec: {
      // Configure qBittorrent.conf in-container, then `exec /init` (the
      // image's s6-overlay entrypoint). runAsInit keeps s6 as PID 1.
      command: ['sh', '/assets/scripts/configure-webui.sh'],
      runAsInit: true,
      // linuxserver images drop privileges to PUID:PGID and set TZ;
      // WEBUI_PORT pins the WebUI port to match the interface + health check;
      // QBT_PW_HASH carries the admin password hash (empty until set);
      // QBT_API_KEY is the Web API key published to dependents;
      // QBT_SAVE_PATH is the resolved download directory inside the container.
      env: {
        PUID: '1000',
        PGID: '1000',
        TZ: 'Etc/UTC',
        WEBUI_PORT: String(uiPort),
        QBT_PEER_PORT: String(peerPort),
        QBT_ANNOUNCE_PORT: String(announcePort),
        QBT_PW_HASH: passwordHash ?? '',
        QBT_API_KEY: apiKey ?? '',
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
