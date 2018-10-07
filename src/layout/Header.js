import React from 'react'
import styled from 'react-emotion'
import { Link as DefaultLink } from 'react-router-dom'

import { GlobalConsumer } from '../GlobalState'
import LogoIconDefault from '../components/Icons/Logo'
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
  align-items: center;
`
// const Notifications = styled('div')`
//   color: white;
//   margin-right: 20px;
// `
const Account = styled('div')`
  display: flex;
  align-items: center;
`
const AccountAddress = styled('div')`
  max-width: 100px;
  color: white;
  font-family: 'Source Code Pro';
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

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
          {({ userAddress, userProfile, loggedIn, signIn }) => {
            const twitterProfile =
              userProfile && userProfile.social.find(s => s.type === 'twitter')
            return loggedIn ? (
              <>
                {/* <Notifications>Notification</Notifications> */}
                <Account>
                  <AccountAddress>
                    <ReverseResolution address={userAddress} />
                  </AccountAddress>
                  <Avatar
                    src={`https://avatars.io/twitter/${
                      twitterProfile
                        ? twitterProfile.value
                        : 'unknowntwitter123abc'
                    }/medium`}
                  />
                </Account>
              </>
            ) : (
              <GlobalConsumer>
                {({ toggleModal }) => (
                  <Button type="light" onClick={signIn}>Sign in</Button>
                )}
              </GlobalConsumer>
            )
          }}
        </GlobalConsumer>
      </RightBar>
    </HeaderInner>
  </HeaderContainer>
)

export default Header
