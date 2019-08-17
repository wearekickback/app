import _ from 'lodash'
import React, { Component } from 'react'
import { injectWeb3 } from 'authereum'
import Button from '../Forms/Button'
import { GlobalConsumer } from '../../GlobalState'
import { WALLET_MODAL } from '../../modals'

const network = 'rinkeby'

export default class WalletModal extends Component {
  constructor() {
    super()
    this.state = {
      isMetamask: this.isMetamask()
    }
  }

  authereumInit = async () => {
    window.sessionStorage.setItem('walletSelection', 'authereum')
    await injectWeb3(network)
    window.ethereum.enable()
  }
  ulInit = async () => {
    window.sessionStorage.setItem('walletSelection', 'universalLogin')
    console.log('TODO')
  }
  metamaskInit = async signIn => {
    window.sessionStorage.setItem('walletSelection', 'metaMask')
    await window.ethereum.enable()
    await signIn()
  }

  isMetamask = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      return true
    }
    return false
  }
  render() {
    return (
      <GlobalConsumer>
        {({ signIn, closeModal }) => (
          <>
            <Button onClick={this.authereumInit}>Authereum</Button>
            <Button onClick={this.ulInit}>UL</Button>
            {this.state.isMetamask && (
              <Button
                onClick={async () => {
                  await this.metamaskInit(signIn)
                  closeModal({ name: WALLET_MODAL })
                }}
              >
                MM
              </Button>
            )}
          </>
        )}
      </GlobalConsumer>
    )
  }
}
