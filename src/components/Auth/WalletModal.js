import _ from 'lodash'
import styled from 'react-emotion'
import React, { Component } from 'react'
import { injectWeb3 } from 'authereum'
import Button from '../Forms/Button'
import { GlobalConsumer } from '../../GlobalState'
import { WALLET_MODAL } from '../../modals'
import mq from '../../mediaQuery'

import { ReactComponent as AuthereumImage } from '../svg/authereum.svg'
import { ReactComponent as ULImage } from '../svg/ul.svg'
import { ReactComponent as MetaMaskImage } from '../svg/metamask.svg'

const WalletsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`
const LogoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
  height: 140px;
  margin-right: 25px;
  @media (max-width: 576px) {
    width: 85px;
    height: 85px;
    margin-bottom: 25px;
    margin-right: 0px;
  }
`
const AuthereumLogo = styled(AuthereumImage)`
  max-height: 75px;
  max-width: 75px;
  height: 100px;
  margin-bottom: 5px;
`
const ULLogo = styled(ULImage)`
  max-height: 75px;
  max-width: 75px;
  height: 100px;
  margin-bottom: 5px;
`
const MetaMaskLogo = styled(MetaMaskImage)`
  max-height: 75px;
  max-width: 75px;
  height: 100px;
  margin-bottom: 5px;
`
const LogoButton = styled(Button)`
  width: 140px;
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
              <LogoContainer>
                <AuthereumLogo />
                <LogoButton
                  onClick={() => {
                    this.authereumInit({ networkState })
                  }}
                >
                  Authereum
                </LogoButton>
              </LogoContainer>
              <LogoContainer>
                <ULLogo />
                <LogoButton onClick={this.ulInit}>Univesal Login</LogoButton>
              </LogoContainer>
              {this.state.isMetamask && (
                <>
                  <LogoContainer>
                    <MetaMaskLogo />
                    <LogoButton
                      onClick={async () => {
                        await this.metamaskInit(signIn)
                        closeModal({ name: WALLET_MODAL })
                      }}
                    >
                      MetaMask
                    </LogoButton>
                  </LogoContainer>
                </>
              )}
            </WalletsContainer>
          </>
        )}
      </GlobalConsumer>
    )
  }
}
