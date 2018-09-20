import React from 'react'
import styled from 'react-emotion'
import SignIn from '../components/Modal/ToggleModal'

const HeaderContainer = styled('header')`
  width: 100%;
  height: 50px;
  display: flex;
  background: #6e76ff;
  justify-content: space-between;
`

const Logo = styled('h1')`
  margin: 0;
`
const RightBar = styled('div')`
  display: flex;
`
const Notifications = styled('div')``
const Account = styled('div')``
const AccountAddress = styled('div')``
const Avatar = styled('img')``

const Header = () => (
  <HeaderContainer>
    <Logo>Kickback</Logo>
    <RightBar>
      <Notifications>Notification</Notifications>
      <Account>
        <AccountAddress>vitalik.eth</AccountAddress>
        <Avatar />
      </Account>
      <SignIn modalName="signIn">Sign in</SignIn>
    </RightBar>
  </HeaderContainer>
)

export default Header
