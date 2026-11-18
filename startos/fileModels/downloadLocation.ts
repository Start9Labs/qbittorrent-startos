import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const downloadLocationFile = 'download-location.json'

/**
 * qBittorrent owns this persisted absolute shared download root; null means private storage.
 * Kept current while stopped, independent of daemon availability.
 */
export const downloadLocationShape = z.looseObject({
  downloadPath: z.string().nullable(),
})

export const downloadLocationJson = FileHelper.json(
  { base: sdk.volumes.public, subpath: `/${downloadLocationFile}` },
  downloadLocationShape,
)
