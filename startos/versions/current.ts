import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.2.1:1',
  releaseNotes: {
    en_US:
      'Fixed the Web UI failing to load after an unclean shutdown, where a stale single-instance lock could trap qBittorrent in a silent restart loop. qBittorrent’s own logs now appear in the StartOS service logs.',
    es_ES:
      'Se corrigió un fallo por el que la interfaz web no cargaba tras un apagado inesperado, donde un bloqueo de instancia única obsoleto podía atrapar a qBittorrent en un bucle de reinicio silencioso. Los registros de qBittorrent ahora aparecen en los registros del servicio de StartOS.',
    de_DE:
      'Behoben: Die Weboberfläche ließ sich nach einem unsauberen Herunterfahren nicht mehr laden, weil eine veraltete Einzelinstanz-Sperre qBittorrent in einer stillen Neustartschleife festhalten konnte. Die Protokolle von qBittorrent erscheinen jetzt in den StartOS-Dienstprotokollen.',
    pl_PL:
      'Naprawiono brak ładowania interfejsu WWW po nieprawidłowym zamknięciu, gdy nieaktualna blokada pojedynczej instancji mogła uwięzić qBittorrent w cichej pętli ponownego uruchamiania. Logi qBittorrent są teraz widoczne w logach usługi StartOS.',
    fr_FR:
      'Correction de l’interface Web qui ne se chargeait plus après un arrêt impropre, un verrou d’instance unique obsolète pouvant bloquer qBittorrent dans une boucle de redémarrage silencieuse. Les journaux de qBittorrent apparaissent désormais dans les journaux du service StartOS.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
