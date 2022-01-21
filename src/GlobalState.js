import _ from 'lodash'
import React, { createContext, Component } from 'react'
import { withApollo } from 'react-apollo'
import jwt from 'jsonwebtoken'
import Web3 from 'web3'
import Onboard from 'bnc-onboard'
import Notify from 'bnc-notify'

import { track } from './api/analytics'
import {
  BLOCKNATIVE_DAPPID,
  INFURA_KEY,
  FORTMATIC_KEY,
  PORTIS_KEY,
  NETWORK_NAME
  // SQUARELINK_KEY
} from './config'
import { identify as logRocketIdentify } from './api/logRocket'
import * as LocalStorage from './api/localStorage'
import { getAccount, updateNetwork, pollForBlocks } from './api/web3'
import { SIGN_IN } from './modals'
import { LOGIN_USER_NO_AUTH } from './graphql/mutations'
import { buildAuthHeaders } from './utils/requests'

const GlobalContext = createContext({})

export default GlobalContext

export const GlobalConsumer = GlobalContext.Consumer

let setProviderInstance
const providerPromise = new Promise(resolve => {
  setProviderInstance = resolve
})

let setSignedIn
const signInPromise = new Promise(resolve => {
  setSignedIn = resolve
})

export const getProvider = () => providerPromise

const AUTH = 'auth'
const WALLET = 'wallet'
const TOKEN_SECRET = 'kickback'
const TOKEN_ALGORITHM = 'HS256'

const walletChecks = [{ checkName: 'connect' }, { checkName: 'network' }]

const getNetworkId = networkId => {
  if (networkId === '35') {
    // Default chainId for ganache
    // return 1337
    return 1337
  } else {
    return parseInt(networkId)
  }
}

const wallets = [
  { walletName: 'coinbase', preferred: true },
  {
    walletName: 'fortmatic',
    apiKey: FORTMATIC_KEY,
    preferred: true
  },
  { walletName: 'metamask', preferred: true },
  { walletName: 'opera', preferred: true },
  { walletName: 'operaTouch', preferred: true },
  {
    walletName: 'portis',
    apiKey: PORTIS_KEY,
    preferred: true
  },
  { walletName: 'status', preferred: true },
  {
    walletName: 'torus',
    buildEnv: 'production',
    showTorusButton: false,
    preferred: true
  },
  { walletName: 'trust', preferred: true },
  {
    walletName: 'walletConnect',
    rpc: {
      '1': `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      '137': `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
      '100': 'https://dai.poa.network'
    },
    preferred: true
  }
]

const getWallets = networkId => {
  console.log({ networkId })
  if ([1, 100, 137].includes(networkId)) {
    return wallets
  } else {
    // only return metamask for localhost
    return [{ walletName: 'metamask', preferred: true }]
  }
}

class Provider extends Component {
  state = {
    apolloClient: this.props.client,
    currentModal: null,
    auth: LocalStorage.getItem(AUTH) || {},
    networkState: {},
    web3: null
  }

  authToken() {
    return this.state.auth.token
  }

  apolloClient() {
    return this.state.apolloClient
  }

  isLoggedIn() {
    return this.state.auth.loggedIn
  }

  setUpWallet = async args => {
    const { action, networkId, dontForceSetUp } = args
    console.log({ action, networkId, dontForceSetUp })
    // Check if user has chosen a wallet before, if so just use that.
    // If not, the user will have to select a wallet so only proceed if required.
    const lastUsedWallet = LocalStorage.getItem(WALLET)
    if (!lastUsedWallet && dontForceSetUp) {
      return null
    }

    let { onboard } = this.state

    if (!onboard) {
      // dappid is mandatory so will have throw away id for local usage.
      let testid = 'c212885d-e81d-416f-ac37-06d9ad2cf5af'
      onboard = Onboard({
        dappId: BLOCKNATIVE_DAPPID || testid,
        networkId: getNetworkId(networkId),
        networkName: NETWORK_NAME || 'local',
        walletCheck: walletChecks,
        walletSelect: {
          heading: 'Select a wallet to connect to Kickback',
          description:
            'To use Kickback you need an Ethereum wallet. Please select one from below:',
          wallets: getWallets(getNetworkId(networkId))
        }
      })
      this.setState({ onboard })

      var notify = Notify({
        dappId: BLOCKNATIVE_DAPPID || testid,
        networkId: parseInt(networkId) // [Integer] The Ethereum network ID your Dapp uses.
      })
      this.setState({ notify })
    }

    let result = {
      action,
      error: false,
      hasBalance: false,
      expectedNetworkId: networkId
    }

    let web3
    try {
      const selected = await onboard.walletSelect(lastUsedWallet)
      if (selected) {
        const ready = await onboard.walletCheck()
        if (ready) {
          const walletState = onboard.getState()
          let {
            address,
            network,
            balance,
            wallet,
            mobileDevice
            // appNetworkId
          } = walletState

          // Save this wallet provider for next login
          LocalStorage.setItem(WALLET, wallet.name)

          const web3 = new Web3(wallet.provider)
          this.setState({ wallet, web3 })

          result = {
            mobileDevice,
            network,
            address,
            walletName: wallet.name,
            ...result
          }

          result.correctNetwork = network === parseInt(networkId)

          // We want to know whether the users have any balances in their walllet
          // but don't want to know how much they do.
          result.hasBalance = parseInt(balance || 0) > 0
          pollForBlocks(web3)
        } else {
          // Connection to wallet failed
          LocalStorage.removeItem(WALLET)
          result.status = 'aborted'
          result.error = true
        }
      } else {
        // User aborted set up
        LocalStorage.removeItem(WALLET)
        result.status = 'aborted'
        result.error = true
      }
    } catch (error) {
      console.log('error onboarding', error)
      result.status = error
      result.error = true
    }
    track('Connect to web3', result)
    return web3
  }

  signIn = async ({ dontForceSignIn } = {}) => {
    if (this.state.loggedIn) {
      return
    }

    if (!dontForceSignIn && !this.state.wallet) {
      const { expectedNetworkId } = this.state.networkState
      await this.setUpWallet({
        action: 'Sign in',
        networkId: expectedNetworkId
      })
    }

    // let's request user's account address
    const address = await this.reloadUserAddress()
    if (!address) {
      return
    }

    console.debug(`Checking if user ${address} is logged in ...`)

    try {
      const token = this.authToken()
      const payload = jwt.verify(token, TOKEN_SECRET, {
        algorithm: TOKEN_ALGORITHM
      })
      if (_.get(payload, 'address', '') !== address) {
        throw new Error('Token not valid for current user address')
      }

      const {
        data: { profile }
      } = await this.apolloClient().mutate({
        mutation: LOGIN_USER_NO_AUTH,
        context: {
          headers: buildAuthHeaders(token)
        }
      })

      console.debug(`User ${address} is logged in and has a profile`)

      this.setUserProfile(profile)
    } catch (err) {
      console.debug(
        `User ${address} is not logged and/or does not have a profile`
      )

      this.setState(state => ({
        auth: {
          ...state.auth,
          token: undefined,
          profile: null,
          loggedIn: false
        }
      }))

      if (!dontForceSignIn) {
        this.showModal({ name: SIGN_IN })

        return signInPromise
      }
    }
  }

  signOut = async () => {
    try {
      this.state.onboard.walletReset()
    } catch (error) {
      console.log(error)
    }

    this.setState(state => ({
      auth: {
        ...state.auth,
        address: undefined,
        token: undefined,
        profile: null,
        loggedIn: false
      },
      wallet: undefined,
      web3: null,
      resetWallet: null
    }))

    // Wipe saved wallet
    LocalStorage.removeItem(WALLET)
  }

  setUserProfile = profile => {
    console.log('Current user', profile)

    logRocketIdentify(profile)

    this.setState(
      state => ({
        auth: {
          ...state.auth,
          profile,
          // need this on both this function and setUserProfile() since they can be called independently of each other
          loggedIn: true
        }
      }),
      /* now we resolve the promsie -> */ setSignedIn
    )
  }

  setAuthTokenFromSignature = (address, sig) => {
    const token = jwt.sign({ address, sig }, TOKEN_SECRET, {
      algorithm: TOKEN_ALGORITHM
    })

    console.log(`New auth token: ${token}`)

    // save to local storage for next time!
    LocalStorage.setItem(AUTH, { token })

    this.setState(state => ({
      auth: {
        ...state.auth,
        token,
        // need this on both this function and setUserProfile() since they can be called independently of each other
        loggedIn: true
      }
    }))
  }

  showModal = modal => {
    this.setState({
      currentModal: modal
    })
  }

  closeModal = modal => {
    this.setState(state => {
      if (state.currentModal && state.currentModal.name === modal.name) {
        return {
          currentModal: null
        }
      } else {
        return state
      }
    })
  }

  async componentDidMount() {
    setProviderInstance(this)

    // Get which network app is on
    const networkState = await updateNetwork()

    // Try and open wallet
    await this.setUpWallet({
      action: 'Sign In',
      networkId: parseInt(networkState.expectedNetworkId),
      dontForceSetUp: true
    })

    // try and sign in!
    await this.signIn({ dontForceSignIn: true })
  }

  setNetworkState = networkState => {
    this.setState({ networkState })
  }

  reloadUserAddress = async () => {
    const address = await getAccount()

    if (address) {
      await new Promise(resolve => {
        this.setState(
          state => ({
            auth: {
              ...state.auth,
              address
            }
          }),
          resolve
        )
      })
    }

    return address
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          apolloClient: this.apolloClient(),
          currentModal: this.state.currentModal,
          userAddress: this.state.auth.address,
          reloadUserAddress: this.reloadUserAddress,
          userProfile: this.state.auth.profile,
          networkState: this.state.networkState,
          loggedIn: this.isLoggedIn(),
          signIn: this.signIn,
          signOut: this.signOut,
          signInError: this.state.signInError,
          showModal: this.showModal,
          closeModal: this.closeModal,
          setAuthTokenFromSignature: this.setAuthTokenFromSignature,
          setUserProfile: this.setUserProfile,
          web3: this.state.web3,
          wallet: this.state.wallet
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

export const GlobalProvider = withApollo(Provider)
