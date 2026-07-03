import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.2.2:0',
  releaseNotes: {
    en_US:
      'Updated qBittorrent to 5.2.2. A bugfix release: deletes a stale single-instance lockfile on hostname mismatch, fixes cross-site Web UI login (SameSite=Lax session cookie), repairs several Web UI and RSS issues, and adds a "show file in file manager" option. Full changelog: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.2. Internal updates (start-sdk 2.0.x)',
    es_ES:
      'Se actualizó qBittorrent a 5.2.2. Versión de corrección de errores: elimina un bloqueo de instancia única obsoleto cuando no coincide el nombre de host, corrige el inicio de sesión entre sitios de la interfaz web (cookie de sesión SameSite=Lax), repara varios problemas de la interfaz web y de RSS, y añade una opción para «mostrar archivo en el gestor de archivos». Registro de cambios completo: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.2. Actualizaciones internas (start-sdk 2.0.x)',
    de_DE:
      'qBittorrent auf 5.2.2 aktualisiert. Eine Fehlerbehebungs-Version: löscht eine veraltete Einzelinstanz-Sperrdatei bei Hostnamen-Abweichung, behebt die seitenübergreifende Web-UI-Anmeldung (SameSite=Lax-Sitzungscookie), korrigiert mehrere Web-UI- und RSS-Probleme und ergänzt eine Option „Datei im Dateimanager anzeigen“. Vollständiges Änderungsprotokoll: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.2. Interne Aktualisierungen (start-sdk 2.0.x)',
    pl_PL:
      'Zaktualizowano qBittorrent do 5.2.2. Wydanie naprawcze: usuwa nieaktualny plik blokady pojedynczej instancji przy niezgodności nazwy hosta, naprawia logowanie do interfejsu WWW między witrynami (ciasteczko sesji SameSite=Lax), poprawia kilka problemów interfejsu WWW i RSS oraz dodaje opcję „pokaż plik w menedżerze plików”. Pełna lista zmian: https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.2. Aktualizacje wewnętrzne (start-sdk 2.0.x)',
    fr_FR:
      'Mise à jour de qBittorrent vers 5.2.2. Une version corrective : supprime un fichier de verrou d’instance unique obsolète en cas de non-correspondance du nom d’hôte, corrige la connexion intersites à l’interface Web (cookie de session SameSite=Lax), répare plusieurs problèmes de l’interface Web et des flux RSS, et ajoute une option « afficher le fichier dans le gestionnaire de fichiers ». Journal des modifications complet : https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.2.2. Mises à jour internes (start-sdk 2.0.x)',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
