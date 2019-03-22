import LogRocket from 'logrocket'

import { LOGROCKET_TOKEN } from '../config'

export const setup = () => {
  if (LOGROCKET_TOKEN) {
    LogRocket.init(LOGROCKET_TOKEN)
  }
  // add to rollbar
  if (typeof window.Rollbar === 'undefined') {
    console.warn(
      'Rollbar not setup, so cannot assign LogRocket session to Rollbar instance!'
    )
  } else {
    LogRocket.getSessionURL(sessionURL => {
      window.Rollbar.configure({
        transform: obj => {
          obj.sessionURL = sessionURL
        }
      })
    })
  }
}

export const identify = profile => {
  if (LOGROCKET_TOKEN) {
    LogRocket.identify(profile.address, {
      name: profile.username || 'Unknown'
    })
  }
}
