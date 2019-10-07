import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'
import Avatar from '../User/Avatar'
import { EDIT_PROFILE, UNIVERSAL_LOGIN } from '../../modals'
import { LogoButton } from '@universal-login/react'
import { universalLoginSdk, useUniversalLogin } from '../../universal-login'

const Account = styled(Link)`
  display: flex;
  align-items: center;
  cursor: pointer;
`
const Username = styled('div')`
  max-width: 100px;
  color: white;
  font-family: 'Muli';
  margin-right: 5px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UniversalLogin = styled('div')`
  margin-left: 15px;
`

function SignInButton() {
  return (
    <GlobalConsumer>
      {({ userProfile, loggedIn, showModal, applicationWallet }) => {
        const twitterProfile =
          userProfile &&
          userProfile.social &&
          userProfile.social.find(s => s.type === 'twitter')

        return loggedIn && userProfile ? (
          <>
            <div>
              <Account to={`/user/${userProfile.username}`}>
                {userProfile ? (
                  <Username data-testid="userprofile-name">
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
            </div>
            <UniversalLogin>
              <LogoButton
                deployedWallet={{
                  ...applicationWallet,
                  sdk: universalLoginSdk
                }}
              />
            </UniversalLogin>
          </>
        ) : (
          <Button
            type="light"
            onClick={() => {
              useUniversalLogin()
              showModal({ name: UNIVERSAL_LOGIN })
            }}
            analyticsId="Sign In"
          >
            Sign in
          </Button>
        )
      }}
    </GlobalConsumer>
  )
}

export default SignInButton
