import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { subfolderPattern } from '../utils'

const { InputSpec, Value, Variants } = sdk

export const inputSpec = InputSpec.of({
  // A union so each target's fields only appear when it is selected — nothing
  // extra to fill in for local storage.
  location: Value.union({
    name: i18n('Download Location'),
    description: i18n(
      "Where qBittorrent saves downloads.\n- Local storage: in qBittorrent's own storage, included in its backups.\n- Shared volume: in a folder on a StartOS shared volume, where other services and devices with access to it can use the files.\n- NextExplorer: in a folder in NextExplorer, where you can browse, download and manage the files.\n- FileBrowser Quantum: in a folder in FileBrowser Quantum, where you can browse, download and manage the files.",
    ),
    default: 'local',
    variants: Variants.of({
      local: {
        name: i18n('Local storage'),
        spec: InputSpec.of({}),
      },
      volume: {
        name: i18n('Shared volume'),
        spec: InputSpec.of({
          volume: Value.dynamicSelect(async ({ effects }) => {
            const grants = await sdk.getSharedVolumes(effects).once()
            const current = await storeJson.read((s) => s.sharedVolumeId).once()
            const writable = grants.filter((v) => !v.readonly)
            return {
              name: i18n('Shared Volume'),
              description: i18n(
                'The shared volume to save downloads on. Only volumes qBittorrent has read/write access to can be chosen; give it access under Shared Volumes in StartOS.',
              ),
              default:
                (writable.find((v) => v.id === current) ?? writable[0])?.id ??
                null,
              values: Object.fromEntries(
                grants.map((v) => [
                  v.id,
                  v.readonly ? `${v.name} (${i18n('read-only')})` : v.name,
                ]),
              ),
              disabled: grants.length
                ? grants.filter((v) => v.readonly).map((v) => v.id)
                : i18n(
                    'qBittorrent has no access to a shared volume yet. Give it access under Shared Volumes in StartOS, then run this action again.',
                  ),
            }
          }),
          subfolder: Value.text({
            name: i18n('Shared Volume Subfolder'),
            description: i18n(
              'Folder on the shared volume where downloads are saved. Created automatically.',
            ),
            default: 'qbittorrent',
            required: true,
            placeholder: 'qbittorrent',
            patterns: [subfolderPattern],
          }),
        }),
      },
      nextexplorer: {
        name: i18n('NextExplorer'),
        spec: InputSpec.of({
          subfolder: Value.text({
            name: i18n('NextExplorer Subfolder'),
            description: i18n(
              'Folder inside NextExplorer where downloads are saved, starting with one of its locations, such as Files. Created automatically; NextExplorer must be installed.',
            ),
            default: 'Files/qbittorrent',
            required: true,
            placeholder: 'Files/qbittorrent',
            patterns: [subfolderPattern],
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
            patterns: [subfolderPattern],
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
      'Choose where qBittorrent saves downloads — locally, on a shared volume, or into NextExplorer or FileBrowser Quantum.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // pre-fill the form with the current values. `other` keeps the subfolders of
  // the targets not selected, so each reappears if the user switches back. The
  // volume itself is left to the select's default, which knows what is granted.
  async ({ effects }) => {
    const store = await storeJson.read().const(effects)
    const target = store?.downloadTarget ?? 'local'
    const { [target]: value, ...other } = {
      local: {},
      volume: { subfolder: store?.sharedVolumeSubpath ?? 'qbittorrent' },
      nextexplorer: {
        subfolder: store?.nextexplorerSubpath ?? 'Files/qbittorrent',
      },
      filebrowser: { subfolder: store?.filebrowserSubpath ?? 'qbittorrent' },
    }
    return { location: { selection: target, value, other } }
  },

  // execution: persist the choice. main.ts + dependencies.ts read these
  // reactively, so saving re-mounts, repoints the save path, and restarts the
  // service. Each target leaves the others' stored subfolders untouched so
  // they survive a round-trip.
  async ({ effects, input }) => {
    const loc = input.location
    if (loc.selection === 'volume') {
      const grant = (await sdk.getSharedVolumes(effects).once()).find(
        (v) => v.id === loc.value.volume,
      )
      if (!grant || grant.readonly) {
        throw new Error(
          i18n(
            'qBittorrent needs read/write access to that shared volume. Change its access under Shared Volumes in StartOS, then run this action again.',
          ),
        )
      }
      return storeJson.merge(effects, {
        downloadTarget: 'volume',
        sharedVolumeId: grant.id,
        sharedVolumeSubpath: loc.value.subfolder,
      })
    }
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
