import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Store only the SHA-256 hash — never plaintext.
// The hash is used reactively so the service restarts when it changes
// (i.e. when the user runs "Set Admin Password").
const shape = z.object({
  adminPasswordHash: z.string().optional().catch(undefined),
  // Where completed downloads are saved. 'local' keeps them on this service's
  // own `main` volume (/downloads); 'filebrowser' writes them into File
  // Browser's data volume so the files are browsable there. Set via the "Set
  // Download Location" action; read reactively in main.ts + dependencies.ts so
  // changing it restarts the service and re-mounts. File Browser runs as
  // uid 1000, same as qBittorrent's PUID, so the files are readable as-is.
  downloadTarget: z.enum(['local', 'filebrowser']).catch('local'),
  // Subfolder inside File Browser's volume to save into (ignored when local).
  filebrowserSubpath: z.string().catch('qbittorrent'),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
