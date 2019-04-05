import getWeb3 from '../../api/web3'
import assist from 'bnc-assist'
import { BLOCKNATIVE_DAPPID } from '../../config'
import { track } from '../../api/analytics'

const Assist = async ({ action, expectedNetworkId }) => {
  let web3
  try {
    web3 = await getWeb3()
  } catch (e) {
    console.log('failed to get web3')
  }
  // dappid is mandatory so will have throw away id for local usage.
  let testid = 'c212885d-e81d-416f-ac37-06d9ad2cf5af'
  let assistInstance = await assist.init({
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
  let state
  let result = {
    status: 'Already on boarded',
    action,
    error: false,
    fallback: false,
    hasBalance: false
  }

  try {
    state = await assistInstance.getState()
  } catch (e) {
    console.log('Blocknative failing to get State', e)
  }
  if (state) {
    console.log('state', JSON.stringify(state.userAgent))
    console.log('state', state)
    let {
      correctNetwork,
      currentProvider,
      legacyWallet,
      legacyWeb3,
      mobileDevice,
      modernWallet,
      modernWeb3,
      supportedNetwork,
      accountAddress,
      web3Version,
      web3Wallet
    } = state
    result = {
      correctNetwork,
      currentProvider,
      legacyWallet,
      legacyWeb3,
      mobileDevice,
      modernWallet,
      modernWeb3,
      supportedNetwork,
      accountAddress,
      web3Version,
      web3Wallet,
      ...result
    }
    // Making sure that current provider is set.
    result.currentProvider = state.currentProvider
    // We want to know whether the users have any balances in their walllet
    // but don't want to know how much they do.
    result.hasBalance = parseInt(state.accountBalance || 0) > 0
  } else {
    result.status = 'Problem getting state'
    result.error = true
    result.fallback = true
  }
  if (state && state.mobileDevice) {
    if (!state.web3Wallet) {
      result.status = 'Mobile wallet not detected'
      result.error = true
    } else {
      if (state.userCurrentNetworkId !== parseInt(expectedNetworkId)) {
        result.status = 'Wrong Network'
        result.error = true
      }
    }
    result.fallback = true
  } else {
    try {
      result.status = await assistInstance.onboard()
    } catch (error) {
      result.status = error
      result.error = true
    }
  }
  console.log('Connect to web3', JSON.stringify(result))
  track('Connect to web3', result)
  return result
}
export default Assist
