import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   *
   * Read the password hash reactively — if it changes (e.g. via
   * the "Set Admin Password" action), the service restarts.
   */
  console.info(i18n('Starting qBittorrent!'))

  const adminPasswordHash = await storeJson
    .read((s) => s.adminPasswordHash)
    .const(effects)

  if (!adminPasswordHash) {
    throw new Error(i18n('Admin password not set. Run "Set Admin Password" action first.'))
  }

  /**
   * ======================== Daemons ========================
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
