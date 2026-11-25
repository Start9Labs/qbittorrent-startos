import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.3.1:0',
  releaseNotes: {
    en_US:
      'Updated qBittorrent to 5.3.1. Fixes WebTorrent trackers being dropped from magnet links, preserves web seed URLs when editing a torrent in the Web UI, and makes resume data saving more reliable at shutdown. The web UI always asks for the admin password, from every device, and refuses requests made from other websites. The username is always `admin`, and the Web UI login settings are restored each time qBittorrent starts. Full notes: https://github.com/qbittorrent/qBittorrent/blob/release-5.3.1/Changelog',
    es_ES:
      'qBittorrent actualizado a 5.3.1. Corrige la eliminación de rastreadores WebTorrent en los enlaces magnet, conserva las URL de semillas web al editar un torrent en la interfaz web y hace más fiable el guardado de los datos de reanudación al apagar. La interfaz web siempre pide la contraseña de administrador, desde cualquier dispositivo, y rechaza las solicitudes hechas desde otros sitios web. El usuario es siempre `admin`, y los ajustes de inicio de sesión de la interfaz web se restablecen cada vez que qBittorrent se inicia. Notas completas: https://github.com/qbittorrent/qBittorrent/blob/release-5.3.1/Changelog',
    de_DE:
      'qBittorrent auf 5.3.1 aktualisiert. Behebt, dass WebTorrent-Tracker aus Magnet-Links verworfen wurden, behält Webseed-URLs beim Bearbeiten eines Torrents in der Weboberfläche bei und speichert Fortsetzungsdaten beim Herunterfahren zuverlässiger. Die Weboberfläche fragt von jedem Gerät aus immer nach dem Admin-Passwort und lehnt Anfragen von anderen Websites ab. Der Benutzername ist immer `admin`, und die Anmeldeeinstellungen der Weboberfläche werden bei jedem Start von qBittorrent wiederhergestellt. Vollständige Hinweise: https://github.com/qbittorrent/qBittorrent/blob/release-5.3.1/Changelog',
    pl_PL:
      'Zaktualizowano qBittorrent do 5.3.1. Naprawia odrzucanie trackerów WebTorrent z linków magnet, zachowuje adresy URL web seed podczas edycji torrenta w interfejsie WWW i zapewnia niezawodniejszy zapis danych wznawiania przy zamykaniu. Interfejs WWW zawsze wymaga hasła administratora, z każdego urządzenia, i odrzuca żądania wysyłane z innych stron internetowych. Nazwa użytkownika to zawsze `admin`, a ustawienia logowania interfejsu WWW są przywracane przy każdym uruchomieniu qBittorrent. Pełne informacje: https://github.com/qbittorrent/qBittorrent/blob/release-5.3.1/Changelog',
    fr_FR:
      'Mise à jour de qBittorrent vers 5.3.1. Corrige la suppression des trackers WebTorrent des liens magnet, conserve les URL de seeds web lors de la modification d’un torrent dans l’interface web et fiabilise l’enregistrement des données de reprise à l’arrêt. L’interface web demande toujours le mot de passe administrateur, depuis n’importe quel appareil, et refuse les requêtes provenant d’autres sites web. Le nom d’utilisateur est toujours `admin`, et les réglages de connexion de l’interface web sont rétablis à chaque démarrage de qBittorrent. Notes complètes : https://github.com/qbittorrent/qBittorrent/blob/release-5.3.1/Changelog',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
