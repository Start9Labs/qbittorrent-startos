import { setupManifest } from '@start9labs/start-sdk'
import { filebrowserDescription, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'qbittorrent',
  title: 'qBittorrent',
  license: 'GPL-2.0',
  packageRepo: 'https://github.com/Start9Labs/qbittorrent-startos',
  upstreamRepo: 'https://github.com/qbittorrent/qBittorrent',
  marketingUrl: 'https://www.qbittorrent.org/',
  donationUrl: 'https://www.qbittorrent.org/donate',
  description: { short, long },
  volumes: ['main'],
  images: {
    qbittorrent: {
      source: {
        dockerTag: 'linuxserver/qbittorrent:5.2.3',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    // Optional. When the user points downloads at FileBrowser Quantum (via the "Set
    // Download Location" action), qBittorrent mounts FileBrowser Quantum's data volume
    // read-write and saves there. Declared optional so qBittorrent runs
    // standalone; the dependency only becomes "required" (in dependencies.ts)
    // while FileBrowser Quantum is the chosen target.
    filebrowser: {
      description: filebrowserDescription,
      optional: true,
      metadata: {
        title: 'FileBrowser Quantum',
        icon: 'https://raw.githubusercontent.com/Start9Labs/filebrowser-quantum-startos/e936a6c85a97b930b43cad5e9c0dd4898a2df567/icon.svg',
      },
    },
  },
})
