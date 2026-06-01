import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   *
   * Read the admin password reactively — if it changes (e.g. via
   * the "Set Admin Password" action), the service restarts.
   */
  console.info(i18n('Starting qBittorrent!'))

  const adminPassword = await storeJson
    .read((s) => s.adminPassword)
    .const(effects)

  if (!adminPassword) {
    throw new Error(i18n('Admin password not set. Run "Set Admin Password" action first.'))
  }

  /**
   * ======================== Daemons ========================
   *
   * The volume is mounted at /config (linuxserver/qbittorrent convention).
   * The qBittorrent config is at /config/qBittorrent/qBittorrent/qBittorrent.conf
   * and contains the WebUI password hash set during install or via the
   * "Set Admin Password" action.
   */
  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'qbittorrent' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/config',
        readonly: false,
      }),
      'qbittorrent-sub',
    ),
    exec: {
      command: sdk.useEntrypoint(),
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
