import { setupManifest } from '@start9labs/start-sdk'
import { alertInstall, filebrowserDescription, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'qbittorrent',
  title: 'qBittorrent',
  license: 'GPL-2.0',
  packageRepo: 'https://github.com/Start9Labs/qbittorrent-startos',
  upstreamRepo: 'https://github.com/qbittorrent/qBittorrent',
  marketingUrl: 'https://www.qbittorrent.org/',
  donationUrl: null,
  docsUrls: ['https://wiki.qbittorrent.org/'],
  description: { short, long },
  volumes: ['main'],
  images: {
    qbittorrent: {
      source: {
        dockerTag: 'linuxserver/qbittorrent:5.2.1',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: alertInstall,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    // Optional. When the user points downloads at File Browser (via the "Set
    // Download Location" action), qBittorrent mounts File Browser's data volume
    // read-write and saves there. Declared optional so qBittorrent runs
    // standalone; the dependency only becomes "required" (in dependencies.ts)
    // while File Browser is the chosen target.
    filebrowser: {
      description: filebrowserDescription,
      optional: true,
      metadata: {
        title: 'File Browser',
        icon: 'https://raw.githubusercontent.com/Start9Labs/filebrowser-startos/fbf1fefb51cca9731f2a9a9e6f790ca150aa9d04/icon.svg',
      },
    },
  },
})
