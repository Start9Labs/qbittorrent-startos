import { i18n } from './i18n'
import { sdk } from './sdk'
import { peerPort, uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Web UI — HTTP
  const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
  const uiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
    preferredExternalPort: uiPort,
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

  // BitTorrent peer port — raw TCP, no HTTP. Lets remote peers connect
  // inbound; without it qBittorrent can only make outbound connections.
  const peerMulti = sdk.MultiHost.of(effects, 'peer-multi')
  const peerOrigin = await peerMulti.bindPort(peerPort, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: peerPort,
    secure: { ssl: false },
  })

  const peer = sdk.createInterface(effects, {
    name: i18n('BitTorrent Peers'),
    id: 'peer',
    description: i18n('Inbound BitTorrent peer connections'),
    type: 'p2p',
    masked: true,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const peerReceipt = await peerOrigin.export([peer])

  return [uiReceipt, peerReceipt]
})
