import React, { Component } from 'react'
import styled from 'react-emotion'
import getWeb3 from '../../api/web3'
import TorusLogo from '../../assets/torus-logo.svg'
import { GlobalConsumer } from '../../GlobalState'

const Torus = styled('div')`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  overflow: hidden;
  margin-left: -18.5px;
  margin-bottom: -42.5px;
  cursor: pointer;
  padding: 5px;
  background-color: white;
  @media (max-width: 576px) {
    margin-left: -15px;
    margin-bottom: 0px;
    margin-top: 17.5px;
  }
`

class TorusButton extends Component {
  constructor() {
    super()

    this.state = {
      isTorusUser: false,
      accountLink: null
    }
  }

  componentDidMount() {
    this.checkForTorusUser()
  }

  async checkForTorusUser() {
    let web3
    try {
      web3 = await getWeb3()
      this.setState({ web3 })
    } catch (e) {
      console.log('failed to get web3')
      this.setState({ isTorusUser: false })
      return
    }

    if (
      web3 &&
      web3.currentProvider &&
      web3.currentProvider.isTorus &&
      window.sessionStorage.getItem('torusIsLoggedIn') === true
    ) {
      this.setState({
        isTorusUser: true
      })
    } else {
      this.setState({ isTorusUser: false })
    }
  }

  render() {
    if (!this.state.isTorusUser) {
      return null
    }

    return (
      <GlobalConsumer>
        {({ loggedIn }) => {
          console.log('loggedIn: ', loggedIn)
          return this.state.isTorusUser && loggedIn ? (
            <Torus
              onClick={() => {
                window.ethereum.enable()
              }}
            >
              <img src={TorusLogo} alt="Torus" />
            </Torus>
          ) : null
        }}
      </GlobalConsumer>
    )
  }
}

export default TorusButton
