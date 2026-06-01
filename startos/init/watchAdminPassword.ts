import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { setAdminPassword } from '../actions/setAdminPassword'
import { storeJson } from '../fileModels/store.json'

/**
 * Watch the store for an admin password hash. If missing, surface a
 * critical task pointing to the "Set Admin Password" action.
 */
export const watchAdminPassword = sdk.setupOnInit(async (effects) => {
  const store = await storeJson.read().const(effects)

  if (!store?.adminPasswordHash) {
    await sdk.action.createOwnTask(effects, setAdminPassword, 'critical', {
      reason: i18n('Set the admin password before signing in'),
    })
  }
})
