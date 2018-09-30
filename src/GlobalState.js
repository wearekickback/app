import React, { createContext, Component } from 'react'

import { getItem } from './api/localStorage'

const GlobalContext = createContext({})

export const GlobalConsumer = GlobalContext.Consumer

let setProviderInstance
const providerPromise = new Promise(resolve => { setProviderInstance = resolve })

export const getProvider = () => providerPromise

export class GlobalProvider extends Component {
  state = {
    currentModal: null,
    userAddress: null,
    auth: {
      token: getItem('authToken')
    }
  }

  componentDidMount () {
    setProviderInstance(this)
  }

  handleModalToggle = modal => {
    this.setState(state => {
      if (state.currentModal === modal) {
        return {
          currentModal: null
        }
      } else {
        return {
          currentModal: modal
        }
      }
    })
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          state: this.state,
          handleModalToggle: this.handleModalToggle
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}
