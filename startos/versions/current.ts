import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.3.0:6',
  releaseNotes: {
    en_US:
      'Fixed first-run API-key initialization for connections from other services. Existing credentials are preserved. Requires StartOS 0.4.2 or later.',
    es_ES:
      'Corregida la inicialización de la clave API en el primer inicio para conexiones desde otros servicios. Se conservan las credenciales existentes. Requiere StartOS 0.4.2 o posterior.',
    de_DE:
      'API-Schlüsselinitialisierung beim ersten Start für Verbindungen anderer Dienste korrigiert. Bestehende Zugangsdaten bleiben erhalten. Erfordert StartOS 0.4.2 oder neuer.',
    pl_PL:
      'Naprawiono inicjalizację klucza API przy pierwszym uruchomieniu dla połączeń z innych usług. Istniejące dane logowania są zachowywane. Wymaga StartOS 0.4.2 lub nowszego.',
    fr_FR:
      'Correction de l’initialisation de la clé API au premier démarrage pour les connexions depuis d’autres services. Les identifiants existants sont conservés. Nécessite StartOS 0.4.2 ou ultérieur.',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
