import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.2.3:0',
  releaseNotes: {
    en_US: `Updated qBittorrent to 5.2.3.

- Fixes RSS feeds not following their specified refresh interval.
- Fixes a potential deadlock when a database transaction fails, and a potentially invalid migration procedure.
- Fixes wrong encoding for Web Seeds and incorrect torrent tracker conversion.
- Fixes a Web UI break caused by an unescaped CSS query selector, and corrects search plugin counting when updating.

Full release notes: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.3`,
    es_ES: `Actualiza qBittorrent a 5.2.3.

- Corrige los canales RSS que no respetaban el intervalo de actualización especificado.
- Corrige un posible bloqueo cuando falla una transacción de la base de datos, y un procedimiento de migración potencialmente inválido.
- Corrige la codificación incorrecta de los Web Seeds y la conversión incorrecta de rastreadores de torrents.
- Corrige una rotura de la interfaz web causada por un selector CSS sin escapar, y corrige el recuento de complementos de búsqueda al actualizar.

Notas de la versión completas: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.3`,
    de_DE: `Aktualisiert qBittorrent auf 5.2.3.

- Behebt RSS-Feeds, die das angegebene Aktualisierungsintervall nicht einhielten.
- Behebt einen möglichen Deadlock bei fehlgeschlagener Datenbanktransaktion sowie ein potenziell ungültiges Migrationsverfahren.
- Behebt die falsche Kodierung von Web Seeds und die fehlerhafte Umwandlung von Torrent-Trackern.
- Behebt einen Fehler in der Web-UI durch einen nicht maskierten CSS-Selektor und korrigiert die Zählung der Suchplugins beim Aktualisieren.

Vollständige Versionshinweise: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.3`,
    pl_PL: `Aktualizuje qBittorrent do 5.2.3.

- Naprawia kanały RSS, które nie stosowały się do ustawionego interwału odświeżania.
- Naprawia możliwe zakleszczenie przy nieudanej transakcji bazy danych oraz potencjalnie nieprawidłową procedurę migracji.
- Naprawia błędne kodowanie Web Seedów i nieprawidłową konwersję trackerów torrentów.
- Naprawia awarię interfejsu WWW spowodowaną niezabezpieczonym selektorem CSS oraz poprawia zliczanie wtyczek wyszukiwania podczas aktualizacji.

Pełne informacje o wydaniu: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.3`,
    fr_FR: `Met à jour qBittorrent vers 5.2.3.

- Corrige les flux RSS qui ne respectaient pas l'intervalle de rafraîchissement défini.
- Corrige un blocage potentiel lorsqu'une transaction de base de données échoue, ainsi qu'une procédure de migration potentiellement invalide.
- Corrige l'encodage erroné des Web Seeds et la conversion incorrecte des trackers de torrents.
- Corrige une rupture de l'interface Web causée par un sélecteur CSS non échappé et corrige le comptage des plugins de recherche lors de la mise à jour.

Notes de version complètes : https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.3`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
