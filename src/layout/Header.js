import React from 'react'
import styled from 'react-emotion'

import { GlobalConsumer } from '../GlobalState'
import Logo from '../components/Icons/LogoFull'
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
      <Logo />
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
                  <Button type="light" onClick={signIn}>
                    Sign in
                  </Button>
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
