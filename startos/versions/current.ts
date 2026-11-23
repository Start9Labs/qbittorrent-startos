import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.3.0:8',
  releaseNotes: {
    en_US:
      'Downloads can now be saved to a StartOS shared volume: give qBittorrent read/write access to one, then choose it in Set Download Location. Requires StartOS 0.4.3 or later.',
    es_ES:
      'Las descargas ahora pueden guardarse en un volumen compartido de StartOS: dé a qBittorrent acceso de lectura y escritura a uno y elíjalo en Establecer ubicación de descargas. Requiere StartOS 0.4.3 o posterior.',
    de_DE:
      'Downloads können jetzt auf einem geteilten StartOS-Volume gespeichert werden: Geben Sie qBittorrent Lese-/Schreibzugriff auf eines und wählen Sie es unter Download-Speicherort festlegen. Erfordert StartOS 0.4.3 oder neuer.',
    pl_PL:
      'Pobrania można teraz zapisywać na woluminie współdzielonym StartOS: przyznaj qBittorrent dostęp do odczytu i zapisu, a następnie wybierz wolumin w akcji Ustaw lokalizację pobierania. Wymaga StartOS 0.4.3 lub nowszego.',
    fr_FR:
      'Les téléchargements peuvent désormais être enregistrés sur un volume partagé StartOS : donnez à qBittorrent un accès en lecture/écriture à un volume, puis choisissez-le dans Définir l’emplacement de téléchargement. Nécessite StartOS 0.4.3 ou ultérieur.',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
