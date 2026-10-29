import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.3.0:1',
  releaseNotes: {
    en_US:
      'Sonarr and Radarr on this server can connect to qBittorrent without its admin password.',
    es_ES:
      'Sonarr y Radarr en este servidor pueden conectarse a qBittorrent sin su contraseña de administrador.',
    de_DE:
      'Sonarr und Radarr auf diesem Server können sich ohne das Admin-Passwort mit qBittorrent verbinden.',
    pl_PL:
      'Sonarr i Radarr na tym serwerze mogą łączyć się z qBittorrent bez jego hasła administratora.',
    fr_FR:
      'Sonarr et Radarr sur ce serveur peuvent se connecter à qBittorrent sans son mot de passe administrateur.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
