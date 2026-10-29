import { utils } from '@start9labs/start-sdk'
import { apiKeyFile } from '../fileModels/apiKey'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const shareApiKey = sdk.setupOnInit(async (effects) => {
  let apiKey = await storeJson.read((s) => s.apiKey).const(effects)
  if (!apiKey) {
    apiKey = `qbt_${utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 28 })}`
    await storeJson.merge(effects, { apiKey })
  }
  await apiKeyFile.write(effects, apiKey)
})
