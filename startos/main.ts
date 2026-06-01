import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting qBittorrent!'))

  // Read the password hash reactively — the service restarts automatically
  // when the user runs the "Set Admin Password" action
  await storeJson.read((s) => s.adminPasswordHash).const(effects)

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
      runAsInit: true,
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
