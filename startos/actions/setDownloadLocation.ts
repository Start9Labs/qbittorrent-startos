import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value, Variants } = sdk

export const inputSpec = InputSpec.of({
  // A union so the FileBrowser Quantum subfolder field only appears when FileBrowser Quantum
  // is the selected target — nothing extra to fill in for local storage.
  location: Value.union({
    name: i18n('Download Location'),
    description: i18n(
      'Where qBittorrent saves completed downloads. "Local storage" keeps them on this service. "NextExplorer" or "FileBrowser Quantum" writes them into that service so you can browse, download, and manage the files there.',
    ),
    default: 'local',
    variants: Variants.of({
      local: {
        name: i18n('Local storage'),
        spec: InputSpec.of({}),
      },
      nextexplorer: {
        name: i18n('NextExplorer'),
        spec: InputSpec.of({
          subfolder: Value.text({
            name: i18n('NextExplorer Subfolder'),
            description: i18n(
              'Folder inside NextExplorer where downloads are saved, starting with the drive name. Created automatically; NextExplorer must be installed.',
            ),
            default: 'Files/qbittorrent',
            required: true,
            placeholder: 'Files/qbittorrent',
          }),
        }),
      },
      filebrowser: {
        name: i18n('FileBrowser Quantum'),
        spec: InputSpec.of({
          subfolder: Value.text({
            name: i18n('FileBrowser Quantum Subfolder'),
            description: i18n(
              'Folder inside FileBrowser Quantum where downloads are saved. Created automatically; FileBrowser Quantum must be installed.',
            ),
            default: 'qbittorrent',
            required: true,
            placeholder: 'qbittorrent',
          }),
        }),
      },
    }),
  }),
})

export const setDownloadLocation = sdk.Action.withInput(
  // id
  'set-download-location',

  // metadata
  async () => ({
    name: i18n('Set Download Location'),
    description: i18n(
      'Choose where qBittorrent saves completed downloads — locally, or into NextExplorer or FileBrowser Quantum.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // pre-fill the form with the current values. `other` keeps the last subfolder
  // around so it reappears if the user switches back to FileBrowser Quantum.
  async ({ effects }) => {
    const target =
      (await storeJson.read((s) => s.downloadTarget).const(effects)) ?? 'local'
    const subfolder =
      (await storeJson.read((s) => s.filebrowserSubpath).const(effects)) ??
      'qbittorrent'
    const nextexplorerSubfolder =
      (await storeJson.read((s) => s.nextexplorerSubpath).const(effects)) ??
      'Files/qbittorrent'
    return {
      location:
        target === 'nextexplorer'
          ? {
              selection: 'nextexplorer' as const,
              value: { subfolder: nextexplorerSubfolder },
              other: { filebrowser: { subfolder } },
            }
          : target === 'filebrowser'
            ? {
                selection: 'filebrowser' as const,
                value: { subfolder },
                other: { nextexplorer: { subfolder: nextexplorerSubfolder } },
              }
            : {
                selection: 'local' as const,
                value: {},
                other: {
                  nextexplorer: { subfolder: nextexplorerSubfolder },
                  filebrowser: { subfolder },
                },
              },
    }
  },

  // execution: persist the choice. main.ts + dependencies.ts read these
  // reactively, so saving re-mounts (or unmounts) FileBrowser Quantum, repoints the
  // save path, and restarts the service. Local leaves the stored subfolder
  // untouched so it survives a round-trip.
  async ({ effects, input }) => {
    const loc = input.location
    if (loc.selection === 'nextexplorer') {
      return storeJson.merge(effects, {
        downloadTarget: 'nextexplorer',
        nextexplorerSubpath: loc.value.subfolder,
      })
    }
    if (loc.selection === 'filebrowser') {
      return storeJson.merge(effects, {
        downloadTarget: 'filebrowser',
        filebrowserSubpath: loc.value.subfolder,
      })
    }
    return storeJson.merge(effects, { downloadTarget: 'local' })
  },
)
