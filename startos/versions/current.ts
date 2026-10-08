import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.2.4:1',
  releaseNotes: {
    en_US: `- Reset Admin Password asks for confirmation before it replaces the current password.
- Set Download Location explains each of its options.
- The subfolder fields refuse a path that starts with a slash or contains a .. folder.`,
    es_ES: `- Restablecer contraseña de administrador pide confirmación antes de reemplazar la contraseña actual.
- Establecer ubicación de descargas explica cada una de sus opciones.
- Los campos de subcarpeta rechazan una ruta que empiece por una barra o contenga una carpeta ..`,
    de_DE: `- „Admin-Passwort zurücksetzen“ fragt nach einer Bestätigung, bevor das aktuelle Passwort ersetzt wird.
- „Download-Speicherort festlegen“ erklärt jede seiner Optionen.
- Die Unterordner-Felder lehnen einen Pfad ab, der mit einem Schrägstrich beginnt oder einen Ordner .. enthält.`,
    pl_PL: `- Zresetuj hasło administratora prosi o potwierdzenie przed zastąpieniem obecnego hasła.
- Ustaw lokalizację pobierania wyjaśnia każdą ze swoich opcji.
- Pola podfolderu odrzucają ścieżkę zaczynającą się od ukośnika lub zawierającą folder ..`,
    fr_FR: `- Réinitialiser le mot de passe admin demande une confirmation avant de remplacer le mot de passe actuel.
- Définir l’emplacement de téléchargement explique chacune de ses options.
- Les champs de sous-dossier refusent un chemin qui commence par une barre oblique ou contient un dossier ..`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
