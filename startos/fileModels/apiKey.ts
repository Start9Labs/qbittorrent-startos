import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const apiKeyFile = FileHelper.string(
  { base: sdk.volumes.main, subpath: '/share/api-key' },
  z.string(),
)
