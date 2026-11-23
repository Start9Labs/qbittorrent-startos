import { downloadLocationJson } from '../fileModels/downloadLocation'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { resolveSharedDownloadPath, resolveSharedVolumeTarget } from '../utils'

export const shareDownloadLocation = sdk.setupOnInit(async (effects) => {
  const downloadPath = await storeJson
    .read(resolveSharedDownloadPath)
    .const(effects)
  const sharedVolume = await storeJson
    .read(resolveSharedVolumeTarget)
    .const(effects)
  await downloadLocationJson.write(effects, { downloadPath, sharedVolume })
})
