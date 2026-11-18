import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.3.0:7',
  releaseNotes: {
    en_US:
      'Publishes the selected shared download folder for other services, including while qBittorrent is stopped. Private local downloads are not shared. Requires StartOS 0.4.2 or later.',
    es_ES:
      'Publica la carpeta de descargas compartida seleccionada para otros servicios, incluso cuando qBittorrent está detenido. Las descargas locales privadas no se comparten. Requiere StartOS 0.4.2 o posterior.',
    de_DE:
      'Veröffentlicht den ausgewählten gemeinsamen Downloadordner für andere Dienste, auch wenn qBittorrent gestoppt ist. Private lokale Downloads werden nicht freigegeben. Erfordert StartOS 0.4.2 oder neuer.',
    pl_PL:
      'Udostępnia innym usługom wybrany współdzielony folder pobierania, także gdy qBittorrent jest zatrzymany. Prywatne lokalne pliki nie są udostępniane. Wymaga StartOS 0.4.2 lub nowszego.',
    fr_FR:
      'Publie le dossier de téléchargement partagé sélectionné pour les autres services, même lorsque qBittorrent est arrêté. Les téléchargements locaux privés ne sont pas partagés. Nécessite StartOS 0.4.2 ou ultérieur.',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
