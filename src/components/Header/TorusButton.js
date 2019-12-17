import React, { useState, useEffect, Component } from 'react'
import styled from 'react-emotion'
import getWeb3 from '../../api/web3'
import TorusLogo from '../../assets/torus-logo.svg'
import { GlobalConsumer } from '../../GlobalState'
import mq from '../../mediaQuery'

const Torus = styled('div')`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  overflow: hidden;
  cursor: pointer;
  padding: 5px;
  background-color: white;
  margin-left: -15px;
  margin-bottom: 0px;
  margin-top: 17px;
  ${mq.small`
    margin-left: -18px;
    margin-bottom: -42px;
  `}
`

function TorusButton() {
  useEffect(() => {
    checkForTorusUser()
  })

  const [isTorusUser, setTorusUser] = useState(false)

  const checkForTorusUser = async () => {
    let web3
    try {
      web3 = await getWeb3()
    } catch (e) {
      console.log('failed to get web3')
      setTorusUser(false)
      return
    }

    if (
      web3 &&
      web3.currentProvider &&
      web3.currentProvider.isTorus &&
      window.sessionStorage.getItem('torusIsLoggedIn') === true
    ) {
      setTorusUser(true)
    } else {
      setTorusUser(false)
    }
  }

  if (!isTorusUser) {
    return null
  }

  return (
    <GlobalConsumer>
      {({ loggedIn }) => {
        console.log('loggedIn: ', loggedIn)
        return isTorusUser && loggedIn ? (
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

export default TorusButton
