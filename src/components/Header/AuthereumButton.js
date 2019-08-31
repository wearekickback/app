import React, { Component } from 'react'
import styled from 'react-emotion'
import getWeb3 from '../../api/web3'
import AuthereumLogo from '../../assets/authereum_shield.svg'
import { GlobalConsumer } from '../../GlobalState'

const Authereum = styled('div')`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  overflow: hidden;
  margin-left: -18.5px;
  margin-bottom: -42.5px;
  cursor: pointer;
  padding: 5px;
  @media (max-width: 576px) {
    margin-left: -15px;
    margin-bottom: 0px;
    margin-top: 17.5px;
  }
`

class AuthereumButton extends Component {
  constructor() {
    super()

    this.state = {
      isAuthereumUser: false,
      accountLink: null
    }
  }

  componentDidMount() {
    this.checkForAuthereumUser()
  }

  async checkForAuthereumUser() {
    let web3
    try {
      web3 = await getWeb3()
      this.setState({ web3 })
    } catch (e) {
      console.log('failed to get web3')
      this.setState({ isAuthereumUser: false })
      return
    }

    if (
      web3 &&
      web3.currentProvider &&
      web3.currentProvider.isAuthereum &&
      (await web3.currentProvider.authereum.isAuthenticated())
    ) {
      this.setState({
        isAuthereumUser: true,
        accountLink: `${web3.currentProvider.authereum.webUri}/account`
      })
    } else {
      this.setState({ isAuthereumUser: false })
    }
  }

  render() {
    if (!this.state.isAuthereumUser) {
      return null
    }

    return (
      <GlobalConsumer>
        {({ loggedIn }) => {
          console.log('loggedIn: ', loggedIn)
          return this.state.isAuthereumUser && loggedIn ? (
            <Authereum
              onClick={() => {
                window.open(this.state.accountLink)
              }}
            >
              <img src={AuthereumLogo} alt="Authereum" />
            </Authereum>
          ) : null
        }}
      </GlobalConsumer>
    )
  }
}

export default AuthereumButton
