import { sdk } from '../sdk'
import { setAdminPassword } from './setAdminPassword'
import { setDownloadLocation } from './setDownloadLocation'

export const actions = sdk.Actions.of()
  .addAction(setAdminPassword)
  .addAction(setDownloadLocation)
