import _ from 'lodash'
import React, { createContext, Component } from 'react'
import { withApollo } from 'react-apollo'
import jwt from 'jsonwebtoken'
import Web3 from 'web3'
import Onboard from 'bnc-onboard'

import { track } from './api/analytics'
import { BLOCKNATIVE_DAPPID } from './config'
import { identify as logRocketIdentify } from './api/logRocket'
import * as LocalStorage from './api/localStorage'
import { getAccount } from './api/web3'
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

class Provider extends Component {
  state = {
    apolloClient: this.props.client,
    currentModal: null,
    auth: LocalStorage.getItem(AUTH) || {},
    wallet: LocalStorage.getItem(WALLET),
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

  setUpWallet = async ({ action }) => {
    let web3
    // dappid is mandatory so will have throw away id for local usage.

    const { onboard } = this.state

    let result = {
      action,
      error: false,
      hasBalance: false
    }

    try {
      // If user has chosen a wallet before then just use that.
      console.log('onboarding', LocalStorage.getItem(WALLET))
      const selected = await onboard.walletSelect(LocalStorage.getItem(WALLET))
      if (selected) {
        const ready = await onboard.walletCheck()

        if (ready) {
          const walletState = onboard.getState()
          let {
            mobileDevice,
            network,
            address,
            wallet: { name: currentProvider }
          } = walletState

          result = {
            mobileDevice,
            currentProvider,
            supportedNetwork: network,
            accountAddress: address,
            ...result
          }

          // console.log(web3, result.currentProvider)

          // result.correctNetwork = network === parseInt(this.state.networkState.expectedNetworkId)

          // We want to know whether the users have any balances in their walllet
          // but don't want to know how much they do.
          // result.hasBalance = parseInt(state.accountBalance || 0) > 0

          // console.log('Connect to web3', JSON.stringify(result))
          // track('Connect to web3', result)

          // console.log(web3, result.currentProvider)
          LocalStorage.setItem(WALLET, result.currentProvider)
          console.log("I'm writing the new web3")
          const web3 = new Web3(walletState.wallet.provider)
          this.setState(
            state => ({
              ...walletState,
              web3,
              resetWallet: onboard.walletReset
            }),
            console.log
          )
          setProviderInstance(this)
          console.log(this.state)
          // this.reloadUserAddress()

          return web3
        }
      }
    } catch (error) {
      console.log('error onboarding', error)
      result.status = error
      result.error = true
      return web3
    }
  }

  signIn = async ({ dontForceSignIn } = {}) => {
    if (this.state.loggedIn) {
      return
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
      this.state.resetWallet()
    } catch (error) {
      console.log(error)
    }

    this.setState(state => ({
      auth: {
        ...state.auth,
        token: undefined,
        profile: null,
        loggedIn: false
      },
      wallet: undefined,
      web3: null,
      resetWallet: null
    }))

    // Wipe saved wallet
    LocalStorage.setItem(WALLET)
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
    this.setState({ networkState: { expectedNetworkId: 42 } })
    // await this.reloadUserAddress()

    const walletChecks = [{ checkName: 'connect' }, { checkName: 'network' }]

    const wallets = [
      { walletName: 'coinbase', preferred: true },
      { walletName: 'trust', preferred: true },
      { walletName: 'metamask', preferred: true },
      { walletName: 'dapper', preferred: true },
      { walletName: 'authereum', preferred: true },
      {
        walletName: 'fortmatic',
        apiKey: 'pk_test_D91CF62E54A9AC42',
        preferred: true
      },
      {
        walletName: 'portis',
        apiKey: '782eb0d4-5ebf-40f6-adfc-58bc2aea0076',
        preferred: true
      },
      {
        walletName: 'walletConnect',
        infuraKey: process.env.REACT_APP_INFURA_KEY
      },
      {
        walletName: 'squarelink',
        apiKey: '14414f9bfd6463f45671'
      },
      { walletName: 'opera' },
      { walletName: 'operaTouch' }
    ]

    let testid = 'c212885d-e81d-416f-ac37-06d9ad2cf5af'
    const onboard = Onboard({
      dappId: BLOCKNATIVE_DAPPID || testid,
      networkId: 42,
      walletCheck: walletChecks,
      walletSelect: {
        wallets: wallets
      }
    })

    console.log(onboard)
    this.setState({ onboard })
    // try and sign in!
    // await this.signIn({ dontForceSignIn: true })

    setProviderInstance(this)
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
    console.log(this.state)
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
          setUpWallet: this.setUpWallet,
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
