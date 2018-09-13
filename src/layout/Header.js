import React from 'react'
import styled from 'react-emotion'

const HeaderContainer = styled('header')``
const Notifications = styled('div')``
const Account = styled('div')``
const Avatar = styled('img')``

const Header = () => (
  <HeaderContainer>
    <h1>Kickback</h1>
    <Notifications>Notification</Notifications>
    <Account>
      <AccountAddress>vitalik.eth</AccountAddress>
      <Avatar />
    </Account>
  </HeaderContainer>
)

export default Header
