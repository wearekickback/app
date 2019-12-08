import React, { useState, useEffect, Component } from 'react'
import styled from 'react-emotion'
import getWeb3 from '../../api/web3'
import AuthereumLogo from '../../assets/authereum_shield.svg'
import { GlobalConsumer } from '../../GlobalState'
import mq from '../../mediaQuery'

const Authereum = styled('div')`
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

function AuthereumButton() {
  useEffect(() => {
    checkForAuthereumUser()
  })

  const [isAuthereumUser, setAuthereumUser] = useState(false)
  const [accountUrl, setAccountUrl] = useState('')

  const checkForAuthereumUser = async () => {
    let web3
    try {
      web3 = await getWeb3()
    } catch (e) {
      console.log('failed to get web3')
      setAuthereumUser(false)
      return
    }

    if (
      web3 &&
      web3.currentProvider &&
      web3.currentProvider.isAuthereum &&
      (await web3.currentProvider.authereum.isAuthenticated())
    ) {
      setAuthereumUser(true)
      setAccountUrl(`${web3.currentProvider.authereum.webUri}/account`)
    } else {
      setAuthereumUser(false)
    }
  }

  if (!isAuthereumUser) {
    return null
  }

  return (
    <GlobalConsumer>
      {({ loggedIn }) => {
        console.log('loggedIn: ', loggedIn)
        return isAuthereumUser && loggedIn ? (
          <Authereum
            onClick={() => {
              window.open(accountUrl)
            }}
          >
            <img src={AuthereumLogo} alt="Authereum" />
          </Authereum>
        ) : null
      }}
    </GlobalConsumer>
  )
}

export default AuthereumButton
