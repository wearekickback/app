import _ from 'lodash'
import React, { createContext, Component } from 'react'
import { withApollo } from 'react-apollo'
import jwt from 'jsonwebtoken'

import { identify as logRocketIdentify } from './api/logRocket'
import * as LocalStorage from './api/localStorage'
import { getAccount } from './api/web3'
import { SIGN_IN } from './modals'
import { LOGIN_USER_NO_AUTH } from './graphql/mutations'
import { buildAuthHeaders } from './utils/requests'
import {
  isUsingUniversalLogin,
  getApplicationWallet,
  useUniversalLogin
} from './universal-login'

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
const TOKEN_SECRET = 'kickback'
const TOKEN_ALGORITHM = 'HS256'

class Provider extends Component {
  state = {
    apolloClient: this.props.client,
    currentModal: null,
    auth: LocalStorage.getItem(AUTH) || {},
    networkState: {}
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
    if (await getApplicationWallet()) {
      useUniversalLogin()
    }
    await this.reloadUserAddress()

    // try and sign in!
    await this.signIn({ dontForceSignIn: true })

    setProviderInstance(this)
  }

  setNetworkState = networkState => {
    this.setState({ networkState })
  }

  reloadUserAddress = async () => {
    let address
    if (isUsingUniversalLogin()) {
      address = await getApplicationWallet().contractAddress
    } else {
      address = await getAccount()
    }

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
          signInError: this.state.signInError,
          showModal: this.showModal,
          closeModal: this.closeModal,
          setAuthTokenFromSignature: this.setAuthTokenFromSignature,
          setUserProfile: this.setUserProfile
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

export const GlobalProvider = withApollo(Provider)
