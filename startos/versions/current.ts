import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.3.0:0',
  releaseNotes: {
    en_US: `Updated qBittorrent to 5.3.0 and start-sdk to 3.1.0.

- Download completed files directly from the Web UI, pause/resume the entire BitTorrent session, and import/export RSS rules.
- Fixes an authentication bypass involving X-Forwarded-For and SMTP injection.
- Stops trusting certificates from a compromised certificate authority (eMudhra).
- Keeps password resets and reverse-proxy settings working with the new Web UI config section.

qBittorrent migrates existing settings and SQLite torrent state on first start. Back up before updating. Search plugins require Python 3.13 or newer (provided by the image). External Web API clients may need updating for changed parameters and POST-only endpoints.

[Full upstream release notes](https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.3.0)`,
    es_ES: `Actualiza qBittorrent a 5.3.0 y start-sdk a 3.1.0.

- Descarga archivos completados directamente desde la interfaz web, pausa o reanuda toda la sesión BitTorrent e importa o exporta reglas RSS.
- Corrige una omisión de autenticación mediante X-Forwarded-For y una inyección SMTP.
- Deja de confiar en los certificados de una autoridad de certificación comprometida (eMudhra).
- Mantiene el restablecimiento de contraseñas y los ajustes del proxy inverso con la nueva sección de configuración web.

qBittorrent migra los ajustes existentes y el estado de los torrents en SQLite al iniciarse por primera vez. Haz una copia de seguridad antes de actualizar. Los complementos de búsqueda requieren Python 3.13 o posterior (incluido en la imagen). Los clientes externos de la API web pueden necesitar una actualización por los cambios de parámetros y los métodos que solo aceptan POST.

[Notas completas de la versión original](https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.3.0)`,
    de_DE: `qBittorrent auf 5.3.0 und start-sdk auf 3.1.0 aktualisiert.

- Fertige Dateien direkt über die Weboberfläche herunterladen, die gesamte BitTorrent-Sitzung pausieren oder fortsetzen und RSS-Regeln importieren oder exportieren.
- Behebt eine Authentifizierungsumgehung über X-Forwarded-For und SMTP-Injection.
- Vertraut Zertifikaten einer kompromittierten Zertifizierungsstelle (eMudhra) nicht mehr.
- Passwortzurücksetzung und Reverse-Proxy-Einstellungen funktionieren mit dem neuen Web-UI-Konfigurationsabschnitt weiter.

qBittorrent migriert vorhandene Einstellungen und den SQLite-Torrentstatus beim ersten Start. Vor dem Update ein Backup erstellen. Suchplugins benötigen Python 3.13 oder neuer (im Image enthalten). Externe Web-API-Clients müssen möglicherweise für geänderte Parameter und ausschließlich per POST erreichbare Endpunkte aktualisiert werden.

[Vollständige Upstream-Versionshinweise](https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.3.0)`,
    pl_PL: `Zaktualizowano qBittorrent do 5.3.0 i start-sdk do 3.1.0.

- Pobieranie ukończonych plików bezpośrednio z interfejsu WWW, wstrzymywanie i wznawianie całej sesji BitTorrent oraz import i eksport reguł RSS.
- Naprawiono obejście uwierzytelniania przez X-Forwarded-For i wstrzykiwanie SMTP.
- Przestaje ufać certyfikatom przejętego urzędu certyfikacji (eMudhra).
- Resetowanie hasła i ustawienia odwrotnego proxy działają z nową sekcją konfiguracji interfejsu WWW.

qBittorrent migruje istniejące ustawienia i stan torrentów w SQLite przy pierwszym uruchomieniu. Przed aktualizacją wykonaj kopię zapasową. Wtyczki wyszukiwania wymagają Pythona 3.13 lub nowszego (dostarczanego w obrazie). Zewnętrzne klienty API WWW mogą wymagać aktualizacji z powodu zmienionych parametrów i punktów końcowych obsługujących wyłącznie POST.

[Pełne informacje o wydaniu upstream](https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.3.0)`,
    fr_FR: `Mise à jour de qBittorrent vers 5.3.0 et de start-sdk vers 3.1.0.

- Téléchargement des fichiers terminés directement depuis l’interface Web, pause ou reprise de toute la session BitTorrent et import ou export des règles RSS.
- Correction d’un contournement de l’authentification via X-Forwarded-For et d’une injection SMTP.
- Ne fait plus confiance aux certificats d’une autorité de certification compromise (eMudhra).
- La réinitialisation du mot de passe et les paramètres du proxy inverse restent fonctionnels avec la nouvelle section de configuration Web.

qBittorrent migre les paramètres existants et l’état des torrents SQLite au premier démarrage. Effectuez une sauvegarde avant la mise à jour. Les plugins de recherche nécessitent Python 3.13 ou ultérieur (fourni par l’image). Les clients externes de l’API Web peuvent nécessiter une mise à jour pour les paramètres modifiés et les points d’accès acceptant uniquement POST.

[Notes de version complètes en amont](https://github.com/qbittorrent/qBittorrent/releases/tag/release-5.3.0)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
