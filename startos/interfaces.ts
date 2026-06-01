import { i18n } from './i18n'
import { sdk } from './sdk'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Web UI
  const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
  const uiOrigin = await uiMulti.bindPort(8080, {
    protocol: 'http',
    preferredExternalPort: 8080,
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: 'ui',
    description: i18n('The qBittorrent web interface'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const uiReceipt = await uiOrigin.export([ui])

  return [uiReceipt]
})
