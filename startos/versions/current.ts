import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.3.0:3',
  releaseNotes: {
    en_US:
      'Uses the StartOS-assigned peer port for tracker and DHT announcements and follows changes automatically. Peer exchange (PEX) can still report port 6881. Disables automatic port forwarding so StartOS manages the mapping.',
    es_ES:
      'Usa el puerto asignado por StartOS en los anuncios a trackers y DHT y sigue sus cambios automáticamente. El intercambio de pares (PEX) aún puede anunciar el puerto 6881. Desactiva el reenvío automático de puertos para que StartOS gestione la asignación.',
    de_DE:
      'Verwendet den von StartOS zugewiesenen Peer-Port für Tracker- und DHT-Ankündigungen und übernimmt Änderungen automatisch. Peer Exchange (PEX) kann weiterhin Port 6881 melden. Automatische Portweiterleitung ist deaktiviert; StartOS verwaltet die Zuordnung.',
    pl_PL:
      'Używa portu przydzielonego przez StartOS w ogłoszeniach trackerów i DHT oraz automatycznie uwzględnia jego zmiany. Wymiana peerów (PEX) nadal może zgłaszać port 6881. Automatyczne przekierowanie portów jest wyłączone; mapowaniem zarządza StartOS.',
    fr_FR:
      'Utilise le port attribué par StartOS pour les annonces aux trackers et au DHT et suit automatiquement ses changements. L’échange de pairs (PEX) peut encore annoncer le port 6881. Désactive la redirection automatique des ports pour laisser StartOS gérer la correspondance.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
