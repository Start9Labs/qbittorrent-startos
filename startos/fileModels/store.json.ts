import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Store only the SHA-256 hash — never plaintext.
// The hash is used reactively so the service restarts when it changes
// (i.e. when the user runs "Set Admin Password").
const shape = z.object({
  adminPasswordHash: z.string().optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
