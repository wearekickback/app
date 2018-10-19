import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import { GlobalConsumer } from '../GlobalState'
import Logo from '../components/Icons/LogoFull'
import Button from '../components/Forms/Button'
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
const Username = styled('div')`
  max-width: 100px;
  color: white;
  font-family: 'Source Code Pro';
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NavLink = styled(Link)`
  color: white;
  margin-right: 30px;
`

const Header = () => (
  <HeaderContainer>
    <HeaderInner>
      <Logo />
      <RightBar>
        <NavLink to="/events">Events</NavLink>
        <GlobalConsumer>
          {({ userAddress, userProfile, loggedIn, signIn, signInError }) => {
            const twitterProfile =
              userProfile && userProfile.social.find(s => s.type === 'twitter')
            return loggedIn ? (
              <>
                {/* <Notifications>Notification</Notifications> */}
                <Account>
                  {userProfile ? (
                    <Username>
                      {userProfile.username}
                    </Username>
                  ) : null}
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
              <Button
                type="light"
                onClick={signIn}
                analyticsId='Sign In'
                data-tip=''
                data-for='sign-in-button-tooltip'
              >
                Sign in
                <ReactTooltip
                  id='sign-in-button-tooltip'
                  getContent={() => signInError}
                  place="bottom"
                  effect="solid"
                  type="dark"
                />
              </Button>
            )
          }}
        </GlobalConsumer>
      </RightBar>
    </HeaderInner>
  </HeaderContainer>
)


export default Header
