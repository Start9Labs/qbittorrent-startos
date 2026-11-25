import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.3.1:0',
  releaseNotes: {
    en_US:
      'Updated qBittorrent to 5.3.1. Fixes WebTorrent trackers being dropped from magnet links, preserves web seed URLs when editing a torrent in the Web UI, and makes resume data saving more reliable at shutdown. Full notes: https://github.com/qbittorrent/qBittorrent/blob/release-5.3.1/Changelog',
    es_ES:
      'qBittorrent actualizado a 5.3.1. Corrige la eliminación de rastreadores WebTorrent en los enlaces magnet, conserva las URL de semillas web al editar un torrent en la interfaz web y hace más fiable el guardado de los datos de reanudación al apagar. Notas completas: https://github.com/qbittorrent/qBittorrent/blob/release-5.3.1/Changelog',
    de_DE:
      'qBittorrent auf 5.3.1 aktualisiert. Behebt, dass WebTorrent-Tracker aus Magnet-Links verworfen wurden, behält Webseed-URLs beim Bearbeiten eines Torrents in der Weboberfläche bei und speichert Fortsetzungsdaten beim Herunterfahren zuverlässiger. Vollständige Hinweise: https://github.com/qbittorrent/qBittorrent/blob/release-5.3.1/Changelog',
    pl_PL:
      'Zaktualizowano qBittorrent do 5.3.1. Naprawia odrzucanie trackerów WebTorrent z linków magnet, zachowuje adresy URL web seed podczas edycji torrenta w interfejsie WWW i zapewnia niezawodniejszy zapis danych wznawiania przy zamykaniu. Pełne informacje: https://github.com/qbittorrent/qBittorrent/blob/release-5.3.1/Changelog',
    fr_FR:
      'Mise à jour de qBittorrent vers 5.3.1. Corrige la suppression des trackers WebTorrent des liens magnet, conserve les URL de seeds web lors de la modification d’un torrent dans l’interface web et fiabilise l’enregistrement des données de reprise à l’arrêt. Notes complètes : https://github.com/qbittorrent/qBittorrent/blob/release-5.3.1/Changelog',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
