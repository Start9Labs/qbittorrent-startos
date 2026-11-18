import { sdk } from '../sdk'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { shareApiKey } from './shareApiKey'
import { shareDownloadLocation } from './shareDownloadLocation'
import { watchAdminPassword } from './watchAdminPassword'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  actions,
  dependencies,
  watchAdminPassword,
  shareApiKey,
  shareDownloadLocation,
)

export const uninit = sdk.setupUninit(versionGraph)
