import React, { Component } from 'react'
import styled from 'react-emotion'
import { Authereum } from 'authereum'
import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'
import getWeb3 from '../../api/web3'
import mq from '../../mediaQuery'

const StyledButton = styled(Button)`
  background: none;
  border: none;
  font-size: 16px;
  padding: 0px;
  text-align: left;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  &:hover {
    background: none;
    border: none;
  }
  ${mq.small`
    padding: 0px;
    text-align: left;
    padding-top: 0px;
    padding-bottom: 0px;
    padding-right: 0px;
  `}
`

class LogoutButton extends Component {
  logOut = async (networkState, logOut) => {
    window.sessionStorage.clear()
    window.localStorage.clear()
    const authereum = new Authereum(networkState.networkName.toLowerCase())
    const provider = authereum.getProvider()
    provider.disable()
    await logOut()
    window.location.reload()
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
