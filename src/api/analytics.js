import { MIXPANEL_ID } from '../config'

export const setup = () => {
  if (MIXPANEL_ID && window.mixpanel) {
    window.mixpanel.init(MIXPANEL_ID)
  }
}

export const track = event => {
  if (MIXPANEL_ID) {
    window.mixpanel.track(event)
  }
}
