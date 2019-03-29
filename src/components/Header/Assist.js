import getWeb3 from '../../api/web3'
import assist from 'bnc-assist'
import { BLOCKNATIVE_DAPPID } from '../../config'
import CONFIG from '../../config'
console.log({ CONFIG, BLOCKNATIVE_DAPPID })
const Assist = async ({ expectedNetworkId }) => {
  const web3 = await getWeb3()
  // dappid is mandatory so will have throw away id for local usage.
  let testid = 'c212885d-e81d-416f-ac37-06d9ad2cf5af'
  let assistInstance = assist.init({
    dappId: BLOCKNATIVE_DAPPID || testid,
    web3: web3,
    networkId: expectedNetworkId,
    images: {
      welcome: {
        src: 'https://kickback.events/card.png',
        srcset: 'Welcome to Kickback'
      },
      complete: {
        src: 'https://kickback.events/card.png',
        srcset: 'Now you are ready to use Kickback'
      }
    }
  })
  let state = await assistInstance.getState()
  console.log('getState')
  console.log({ state })
  if (state.mobileDevice) {
    console.log('this is mobile')
    return { state, mobile: true }
  } else {
    console.log('this is desktop')
    try {
      let onboardResult = await assistInstance.onboard()
      return { state, onboardResult }
    } catch (error) {
      return { state, error }
    }
  }
}
export default Assist
