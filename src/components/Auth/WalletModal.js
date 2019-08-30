import _ from 'lodash'
import styled from 'react-emotion'
import React, { Component } from 'react'
import { injectWeb3 } from 'authereum'
import Button from '../Forms/Button'
import { GlobalConsumer } from '../../GlobalState'
import { WALLET_MODAL } from '../../modals'

const WalletsContainer = styled('div')`
  display: flex;
  flex-direction: row;
`
const IndividualContainer = styled('div')`
  display: flex;
  flex-direction: column;
  width: 125px;
`

export default class WalletModal extends Component {
  constructor() {
    super()
    this.state = {
      isMetamask: this.isMetamask()
    }
  }

  authereumInit = async networkState => {
    window.sessionStorage.setItem('walletSelection', 'authereum')
    await injectWeb3(networkState.networkState.networkName.toLowerCase())
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
        {({ signIn, closeModal, networkState }) => (
          <>
            <WalletsContainer>
              <IndividualContainer>
                <Button
                  onClick={() => {
                    this.authereumInit({ networkState })
                  }}
                >
                  Authereum
                </Button>
              </IndividualContainer>
              <IndividualContainer>
                <Button onClick={this.ulInit}>UL</Button>
              </IndividualContainer>
              {this.state.isMetamask && (
                <IndividualContainer>
                  <Button
                    onClick={async () => {
                      await this.metamaskInit(signIn)
                      closeModal({ name: WALLET_MODAL })
                    }}
                  >
                    MM
                  </Button>
                </IndividualContainer>
              )}
            </WalletsContainer>
          </>
        )}
      </GlobalConsumer>
    )
  }
}
