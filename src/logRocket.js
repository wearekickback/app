import LogRocket from 'logrocket'

import { LOGROCKET_TOKEN } from './config'

if (LOGROCKET_TOKEN) {
  LogRocket.init(LOGROCKET_TOKEN)
}

export const init = () => {
  if (LOGROCKET_TOKEN) {
    LogRocket.init()
  }
}

export const identify = profile => {
  if (LOGROCKET_TOKEN) {
    LogRocket.identify(profile.address, {
      name: profile.username || 'Unknown'
    })
  }
}
