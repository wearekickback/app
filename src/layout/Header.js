import React from 'react'
import styled from 'react-emotion'
import { Link as DefaultLink } from 'react-router-dom'

import ToggleModal from '../components/Modal/ToggleModal'
import { GlobalConsumer } from '../GlobalState'
import LogoIconDefault from '../components/Icons/Logo'
import { SIGN_IN } from '../modals'
import Button from '../components/Forms/Button'
import ReverseResolution from '../components/ReverseResolution'
import Avatar from '../components/User/Avatar'

const HeaderContainer = styled('header')`
  width: 100%;
  height: 70px;
  background: #6e76ff;
  margin-bottom: 50px;
  padding: 0 20px;
`

const HeaderInner = styled('div')`
  margin: 0 auto 0;
  max-width: 1200px;
  height: 100%;
  display: flex;
  background: #6e76ff;
  justify-content: space-between;
  align-items: center;
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
    font-family: Muli;
    color: white;
  }
`
const RightBar = styled('div')`
  display: flex;
`
const Notifications = styled('div')`
  color: white;
  margin-right: 20px;
`
const Account = styled('div')``
const AccountAddress = styled('div')``

const Header = () => (
  <HeaderContainer>
    <HeaderInner>
      <Logo>
        <Link to="/">
          <LogoIcon />
          Kickback
        </Link>
      </Logo>
      <RightBar>
        <GlobalConsumer>
          {({ userAddress, userProfile, loggedIn }) =>
            loggedIn ? (
              <>
                <Notifications>Notification</Notifications>
                <Account>
                  <AccountAddress>
                    <ReverseResolution address={userAddress} />
                  </AccountAddress>

                  {console.log('USER', userProfile)}
                  <Avatar
                    src={`https://avatars.io/twitter/${userProfile &&
                      userProfile.social.find(s => s.type === 'twitter')
                        .value}/medium`}
                  />
                </Account>
              </>
            ) : (
              <ToggleModal modalName={SIGN_IN}>
                <Button type="light">Sign in</Button>
              </ToggleModal>
            )
          }
        </GlobalConsumer>
      </RightBar>
    </HeaderInner>
  </HeaderContainer>
)

export default Header
