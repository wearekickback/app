import React, { Component } from 'react'
import styled from 'react-emotion'
import { injectWeb3 } from 'authereum'
import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'
import getWeb3 from '../../api/web3'

const StyledButton = styled(Button)`
  background: none;
  border: none;
  font-size: 16px;
  &:hover {
    background: none;
    border: none;
  }
  @media (max-width: 576px) {
    padding: 0px;
    text-align: left;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`

class LogoutButton extends Component {
  logOut = async (networkState, logOut) => {
    window.sessionStorage.setItem('walletSelection', 'authereum')
    await injectWeb3(networkState.networkState.networkName.toLowerCase())
    window.ethereum.disable()
    console.log('1')
    await logOut()
    console.log('2')
  }
  render() {
    return (
      <GlobalConsumer>
        {({ loggedIn, networkState, logOut }) => {
          return loggedIn ? (
            <StyledButton
              onClick={() => {
                this.logOut(networkState, logOut)
              }}
            >
              Logout
            </StyledButton>
          ) : null
        }}
      </GlobalConsumer>
    )
  }
}

export default LogoutButton
