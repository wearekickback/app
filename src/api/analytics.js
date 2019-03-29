import { MIXPANEL_ID } from '../config'
console.log({ MIXPANEL_ID })
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
