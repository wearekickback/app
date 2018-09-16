import React from 'react'
import styled from 'react-emotion'
import SignIn from '../components/Modal/ToggleModal'

const HeaderContainer = styled('header')``
const Notifications = styled('div')``
const Account = styled('div')``
const AccountAddress = styled('div')``
const Avatar = styled('img')``

const Header = () => (
  <HeaderContainer>
    <h1>Kickback</h1>
    <Notifications>Notification</Notifications>
    <Account>
      <AccountAddress>vitalik.eth</AccountAddress>
      <Avatar />
    </Account>
    <SignIn modalName="signIn">Sign in</SignIn>
  </HeaderContainer>
)

export default Header
