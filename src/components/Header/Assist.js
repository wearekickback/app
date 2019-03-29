import getWeb3 from '../../api/web3'
import assist from 'bnc-assist'
import { BLOCKNATIVE_DAPPID } from '../../config'
import CONFIG from '../../config'
import { track } from '../../api/analytics'

console.log({ CONFIG, BLOCKNATIVE_DAPPID })
const Assist = async ({ action, expectedNetworkId }) => {
  let msg
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
  let result = { state, status: 'Already on boarded' }
  if (state.mobileDevice) {
    result.mobile = true
    if (!state.web3Wallet) {
      result.status = 'Mobile wallet not detected'
    } else {
      if (state.userCurrentNetworkId !== expectedNetworkId) {
        result.status = 'Wrong Network'
      }
    }
    msg = `Connect Web3:mobile:${action}:${result.status}`
  } else {
    try {
      result.status = await assistInstance.onboard()
    } catch (error) {
      result.status = error
    } finally {
      msg = `Connect web3:desktop:${action}:${result.status}`
    }
  }
  console.log(msg, result)
  track(msg, result)
  return result
}
export default Assist
