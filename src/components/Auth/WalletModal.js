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
    console.log('IN?')
    window.ethereum = undefined
    window.web3 = undefined
    await injectWeb3(network)
    console.log(window.ethereum)
    window.ethereum.enable()
    console.log(window.ethereum)
  }
  ulInit = async () => {
    console.log('TODO')
  }
  metamaskInit = async () => {
    window.ethereum.enable()
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
        {({ closeModal }) => (
          <>
            <Button onClick={this.authereumInit}>Authereum</Button>
            <Button onClick={this.ulInit}>UL</Button>
            {this.state.isMetamask && (
              <Button
                onClick={async () => {
                  await this.metamaskInit()
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
