import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '5.2.1:0',
  releaseNotes: {
    en_US: 'Initial release.',
    es_ES: 'Versión inicial.',
    de_DE: 'Erste Version.',
    pl_PL: 'Wersja początkowa.',
    fr_FR: "Version initiale.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
