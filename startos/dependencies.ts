import { T } from '@start9labs/start-sdk'
import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const deps: T.CurrentDependenciesResult<any> = {}

  // Only depend on FileBrowser Quantum while it is the chosen download target. This
  // drives the warning UI (e.g. "FileBrowser Quantum isn't installed") without ever
  // blocking qBittorrent's own startup. `kind: 'exists'` (not 'running'):
  // qBittorrent writes into FileBrowser Quantum's volume whether or not FileBrowser Quantum
  // is running — it just needs to be installed so the volume exists.
  const target = await storeJson.read((s) => s.downloadTarget).const(effects)
  if (target === 'filebrowser') {
    deps['filebrowser'] = {
      kind: 'exists',
      versionRange: '>=2.63.18:3',
    }
  }

  return deps
})
