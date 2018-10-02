import React from 'react'
import styled from 'react-emotion'
import { Link as DefaultLink } from 'react-router-dom'
import ToggleModal from '../components/Modal/ToggleModal'

import { GlobalConsumer } from '../GlobalState'
import LogoIconDefault from '../components/Icons/Logo'
import { SIGN_IN } from '../modals'

const HeaderContainer = styled('header')`
  width: 100%;
  height: 70px;
  background: #6e76ff;
  margin-bottom: 50px;
`

// const HeaderInner = styled('div')`
//   margin-left: 40px;
//   margin-right: 40px;
//   height: 100%;
//   display: flex;
//   background: #6e76ff;
//   justify-content: space-between;
//   align-items: center;
// `

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
    font-family: Muli;
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
      <GlobalConsumer>
        {({ userAddress, userProfile, loggedIn }) => (
          loggedIn ? (
            <>
              <Notifications>Notification</Notifications>
              <Account>
                <AccountAddress>{userAddress}</AccountAddress>
                {console.log(userProfile)}
                <Avatar />
              </Account>
            </>
          ) : (
            <ToggleModal modalName={SIGN_IN}>Sign in</ToggleModal>
          )
        )}
      </GlobalConsumer>
    </RightBar>
  </HeaderContainer>
)

export default Header
