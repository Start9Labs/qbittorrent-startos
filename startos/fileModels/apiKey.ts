import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const apiKeyFile = FileHelper.string(
  { base: sdk.volumes.public, subpath: '/api-key' },
  z.string(),
)
