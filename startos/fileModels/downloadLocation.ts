import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const downloadLocationFile = 'download-location.json'

/**
 * Where qBittorrent saves downloads, for dependents. Follows the persisted
 * selection, including while qBittorrent is stopped.
 *
 * `downloadPath` is the download root inside a file manager's volume, valid
 * only with that volume mounted at `nextexplorerMountpoint` or
 * `filebrowserMountpoint`; null otherwise. `sharedVolume` is set instead when
 * downloads go to a StartOS shared volume: a dependent needs its own grant to
 * that volume and mounts it itself, so there is no path to hand over.
 */
export const downloadLocationShape = z.looseObject({
  downloadPath: z.string().nullable().catch(null),
  sharedVolume: z
    .looseObject({ id: z.string(), subpath: z.string() })
    .nullable()
    .catch(null),
})

export const downloadLocationJson = FileHelper.json(
  { base: sdk.volumes.public, subpath: `/${downloadLocationFile}` },
  downloadLocationShape,
)
