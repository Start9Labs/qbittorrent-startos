import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.2.4:0',
  releaseNotes: {
    en_US: `Updated qBittorrent to 5.2.4. Fixes Web UI issues with adding torrents, manually adding peers, and non-HTTP(S) links in RSS articles and search results.

Full release notes: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.4`,
    es_ES: `Actualiza qBittorrent a 5.2.4. Corrige problemas en la interfaz web al añadir torrents y pares manualmente, y restringe los enlaces de artículos RSS y resultados de búsqueda a direcciones HTTP(S).

Notas de la versión completas: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.4`,
    de_DE: `Aktualisiert qBittorrent auf 5.2.4. Behebt Probleme der Web-UI beim Hinzufügen von Torrents und Peers und beschränkt Links in RSS-Artikeln und Suchergebnissen auf HTTP(S)-Adressen.

Vollständige Versionshinweise: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.4`,
    pl_PL: `Aktualizuje qBittorrent do 5.2.4. Naprawia problemy interfejsu WWW podczas dodawania torrentów i peerów oraz ogranicza linki w artykułach RSS i wynikach wyszukiwania do adresów HTTP(S).

Pełne informacje o wydaniu: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.4`,
    fr_FR: `Met à jour qBittorrent vers 5.2.4. Corrige des problèmes de l'interface Web lors de l'ajout de torrents et de pairs, et limite les liens des articles RSS et des résultats de recherche aux adresses HTTP(S).

Notes de version complètes : https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.4`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
