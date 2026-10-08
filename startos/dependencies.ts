import { storeJson } from './fileModels/store.json'
import {
  filebrowserDescription,
  nextexplorerDescription,
} from './manifest/i18n'
import { sdk } from './sdk'

// Each is declared only while it is the download target, as `exists`: qBittorrent writes into its data volume whether or not it is running.
export const dependencies = sdk.Dependencies.of()
  .addDependency(
    sdk.Dependency.optional('nextexplorer', {
      description: nextexplorerDescription,
      metadata: {
        title: 'NextExplorer',
        icon: 'https://raw.githubusercontent.com/Start9Labs/nextexplorer-startos/04f7ecbfc31ad2205e0222dd7568fb881aa06c79/icon.svg',
      },
      versionRange: '>=2.2.7:0',
      kind: 'exists',
      enabled: async ({ effects }) =>
        (await storeJson.read((s) => s.downloadTarget).const(effects)) ===
        'nextexplorer',
    }),
  )
  .addDependency(
    sdk.Dependency.optional('filebrowser', {
      description: filebrowserDescription,
      metadata: {
        title: 'FileBrowser Quantum',
        icon: 'https://raw.githubusercontent.com/Start9Labs/filebrowser-quantum-startos/e936a6c85a97b930b43cad5e9c0dd4898a2df567/icon.svg',
      },
      versionRange: '>=2.63.18:3 || >=#quantum:1.5.2:0',
      kind: 'exists',
      enabled: async ({ effects }) =>
        (await storeJson.read((s) => s.downloadTarget).const(effects)) ===
        'filebrowser',
    }),
  )
