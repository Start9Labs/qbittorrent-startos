import { rm } from 'fs/promises'
import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_5_3_0_5 = VersionInfo.of({
  version: '5.3.0:5',
  releaseNotes: {
    en_US: 'StartOS package improvements; no change to qBittorrent.',
    es_ES: 'Mejoras del paquete de StartOS; sin cambios en qBittorrent.',
    de_DE: 'Verbesserungen am StartOS-Paket; keine Änderung an qBittorrent.',
    pl_PL: 'Ulepszenia pakietu StartOS; bez zmian w qBittorrent.',
    fr_FR:
      'Améliorations du paquet StartOS ; aucun changement pour qBittorrent.',
  },
  migrations: {
    up: async () => {
      await rm(sdk.volumes.main.subpath('share'), {
        recursive: true,
        force: true,
      })
    },
    down: IMPOSSIBLE,
  },
})
