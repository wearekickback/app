import React from 'react'
import styled from 'react-emotion'
import { Link as DefaultLink } from 'react-router-dom'
import ToggleModal from '../components/Modal/ToggleModal'

import LogoIconDefault from '../components/Icons/Logo'
import { SIGN_IN } from '../modals'

const HeaderContainer = styled('header')`
  width: 100%;
  height: 70px;
  display: flex;
  background: #6e76ff;
  justify-content: space-between;
  align-items: center;
  color: white;
`

const Link = styled(DefaultLink)`
  display: flex;
  align-items: center;
`

const LogoIcon = styled(LogoIconDefault)`
  margin-right: 5px;
`

const Logo = styled('h1')`
  margin: 0;
  font-size: 22px;

  a {
    font-family: Helvetica;
    color: white;
  }
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
    <Logo>
      <Link to="/">
        <LogoIcon />
        Kickback
      </Link>
    </Logo>
    <RightBar>
      <Notifications>Notification</Notifications>
      <Account>
        <AccountAddress>vitalik.eth</AccountAddress>
        <Avatar />
      </Account>
      <ToggleModal modalName={SIGN_IN}>Sign in</ToggleModal>
    </RightBar>
  </HeaderContainer>
)

export default Header
