import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

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
        dockerTag: 'linuxserver/qbittorrent:5.2.4',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
