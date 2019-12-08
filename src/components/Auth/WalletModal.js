import styled from 'react-emotion'
import React, { Component } from 'react'
import { Authereum } from 'authereum'
import Web3 from 'web3'
import Button from '../Forms/Button'
import { GlobalConsumer } from '../../GlobalState'
import { WALLET_MODAL } from '../../modals'
import mq from '../../mediaQuery'

import { ReactComponent as AuthereumImage } from '../svg/authereum.svg'
import { ReactComponent as ULImage } from '../svg/ul.svg'
import { ReactComponent as MetaMaskImage } from '../svg/metamask.svg'
import WebThreeImage from '../svg/web3.png'

const WalletsContainer = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  ${mq.medium`
    flex-direction: row;
  `}
`
const TitleContainer = styled('h3')`
  text-align: center;
`
const LogoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  width: 85px;
  height: 175px;
  margin-bottom: 25px;
  margin-right: 0px;
  margin-left: 0px;
  align-items: center;
  ${mq.small`
    width: 140px;
    height: 140px;
    margin-right: 10px;
    margin-left: 10px;
  `}
`
const LogoText = styled('div')`
  font-size: 10px;
  height: 25px;
  text-align: center;
  margin-bottom: 15px;
  width: 100px;
  ${mq.small`
    margin-bottom: 10px;
  `}
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
const WebThreeLogo = styled('img')`
  max-height: 60px;
  max-width: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
  ${mq.small`
    max-height: 50px;
    margin-bottom: 5px;
    height: 100px;
  `}
`
const LogoButton = styled(Button)`
  width: 150px;
`

export default class WalletModal extends Component {
  constructor() {
    super()
    this.state = {
      isWeb3Injected: this.isWeb3()
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  authereumInit = async (networkState, signIn) => {
    window.sessionStorage.setItem('walletSelection', 'authereum')

    const networkName = 'mainnet'
    const authereum = new Authereum(networkName)
    // const authereum = new Authereum(networkState.networkName.toLowerCase())
    const provider = authereum.getProvider()
    provider.enable()
    provider.isMetaMask = false

    let didCloseModal = false
    while (didCloseModal === false) {
      // Wait a reasonable amount of time to see if the popup has closed
      await this.sleep(3000)
      didCloseModal = await signIn()
    }
  }

  ulInit = async () => {
    window.sessionStorage.setItem('walletSelection', 'universalLogin')
    console.log('TODO')
  }
  web3Init = async signIn => {
    window.sessionStorage.setItem('walletSelection', 'metaMask')
    await window.ethereum.enable()
    await signIn()
  }

  isWeb3 = () => {
    if (window.ethereum) {
      return true
    }
    return false
  }
  render() {
    return (
      <GlobalConsumer>
        {({ signIn, closeModal, networkState }) => (
          <>
            <TitleContainer>Choose your wallet</TitleContainer>
            <WalletsContainer>
              {this.state.isWeb3Injected && (
                <>
                  <LogoContainer>
                    <LogoText>
                      I am connected to Metamask, Status.im, etc.
                    </LogoText>
                    <WebThreeLogo src={WebThreeImage} />
                    <LogoButton
                      onClick={async () => {
                        await this.web3Init(signIn)
                        closeModal({ name: WALLET_MODAL })
                      }}
                    >
                      Web3
                    </LogoButton>
                  </LogoContainer>
                </>
              )}
              <LogoContainer>
                <LogoText>I am not connected to an Ethereum wallet</LogoText>
                <AuthereumLogo />
                <LogoButton
                  onClick={() => {
                    this.authereumInit(networkState, signIn)
                    closeModal({ name: WALLET_MODAL })
                  }}
                >
                  Authereum
                </LogoButton>
              </LogoContainer>
            </WalletsContainer>
          </>
        )}
      </GlobalConsumer>
    )
  }
}
