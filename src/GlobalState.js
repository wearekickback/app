import React, { createContext, Component } from 'react'
import { withApollo } from 'react-apollo'
import jwt from 'jsonwebtoken'

import * as LocalStorage from './api/localStorage'
import { getAccount } from './api/web3'
import { SIGN_IN } from './modals'

const GlobalContext = createContext({})

export const GlobalConsumer = GlobalContext.Consumer

let setProviderInstance
const providerPromise = new Promise(resolve => { setProviderInstance = resolve })

let setSignedIn
const signInPromise = new Promise(resolve => { setSignedIn = resolve })

export const getProvider = () => providerPromise

const AUTH = 'auth'

class Provider extends Component {
  state = {
    apolloClient: this.props.client,
    currentModal: null,
    auth: LocalStorage.getItem(AUTH) || {}
  }

  authToken () {
    return this.state.auth.token
  }

  apolloClient () {
    return this.state.apolloClient
  }

  isLoggedIn () {
    return this.state.auth.loggedIn
  }

  async signIn () {
    this.setState(state => ({
      auth: {
        ...state.auth,
        token: undefined,
        profile: null,
        loggedIn: false,
      }
    }))

    this.showModal(SIGN_IN)

    return signInPromise
  }

  setUserProfile = profile => {
    this.setState(state => ({
      auth: {
        ...state.auth,
        profile,
        // need this on both this function and setUserProfile() since they can be called independently of each other
        loggedIn: true,
      }
    }), /* now we resolve the promsie -> */ setSignedIn)
  }

  setAuthTokenFromSignature = (address, sig) => {
    const token = jwt.sign({ address, sig }, 'kickback', { algorithm: 'HS256' })

    console.log(`New auth token: ${token}`)

    // save to local storage for next time!
    LocalStorage.setItem(AUTH, { token })

    this.setState(state => ({
      auth: {
        ...state.auth,
        token,
        // need this on both this function and setUserProfile() since they can be called independently of each other
        loggedIn: true,
      }
    }))
  }

  showModal = modal => {
    this.setState({
      currentModal: modal
    })
  }

  toggleModal = modal => {
    this.setState(state => (
      (state.currentModal === modal)
        ? { currentModal: null }
        : { currentModal: modal }
    ))
  }

  async componentDidMount () {
    setProviderInstance(this)

    const address = await getAccount()

    this.setState(state => ({
      auth: {
        ...state.auth,
        address,
      }
    }))
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          currentModal: this.state.currentModal,
          userAddress: this.state.auth.address,
          userProfile: this.state.auth.profile,
          loggedIn: this.isLoggedIn(),
          toggleModal: this.toggleModal,
          showModal: this.showModal,
          setAuthTokenFromSignature: this.setAuthTokenFromSignature,
          setUserProfile: this.setUserProfile,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

export const GlobalProvider = withApollo(Provider)
