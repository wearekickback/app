import React, { Component } from 'react'
import Button from './Forms/Button'
import Assist from './Header/Assist'
import { GlobalConsumer } from '../GlobalState'
import { SIGN_IN_CHOICE, UNIVERSAL_LOGIN } from '../modals'

export default class SignInFlowSelector extends Component {
  renderUniversalLogin(showModal, closeModal) {
    closeModal({ name: SIGN_IN_CHOICE })
    showModal({ name: UNIVERSAL_LOGIN })
  }
  async renderMetaMask(networkState, reloadUserAddress, showTooltip, signIn) {
    let assist = await Assist({
      action: 'Sign in',
      expectedNetworkId: networkState.expectedNetworkId
    })
    const address = await reloadUserAddress()
    if (!networkState.allGood || !address) {
      if (assist.fallback) {
        return showTooltip()
      }
    } else {
      signIn()
    }
  }

  onMetaMaskClick(
    networkState,
    reloadUserAddress,
    showTooltip,
    signIn,
    closeModal
  ) {
    this.renderMetaMask(networkState, reloadUserAddress, showTooltip, signIn)
    closeModal({ name: SIGN_IN_CHOICE })
  }

  render() {
    return (
      <GlobalConsumer>
        {({
          reloadUserAddress,
          userProfile,
          networkState,
          loggedIn,
          signIn,
          showModal,
          closeModal
        }) => (
          <div>
            <Button
              onClick={() => {
                this.renderUniversalLogin(showModal, closeModal)
              }}
            >
              UNIVERSAL LOGIN
            </Button>
            <Button
              onClick={() =>
                this.onMetaMaskClick(
                  networkState,
                  reloadUserAddress,
                  () => {},
                  signIn,
                  closeModal
                )
              }
            >
              META MASK
            </Button>
          </div>
        )}
      </GlobalConsumer>
    )
  }
}
