import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const downloadLocationFile = 'download-location.json'

/**
 * The shared download root qBittorrent saves to; null for local storage.
 * Valid only with the file manager's volume mounted at `nextexplorerMountpoint`
 * or `filebrowserMountpoint`. Follows the persisted selection, including while
 * qBittorrent is stopped.
 */
export const downloadLocationShape = z.looseObject({
  downloadPath: z.string().nullable().catch(null),
})

export const downloadLocationJson = FileHelper.json(
  { base: sdk.volumes.public, subpath: `/${downloadLocationFile}` },
  downloadLocationShape,
)
