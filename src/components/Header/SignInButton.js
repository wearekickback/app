import React from 'react'
import styled from 'react-emotion'

import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'
import Avatar from '../User/Avatar'
import { EDIT_PROFILE, UNIVERSAL_LOGIN } from '../../modals'

const Account = styled('div')`
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

function SignInButton() {
  return (
    <GlobalConsumer>
      {({ userProfile, loggedIn, showModal }) => {
        const twitterProfile =
          userProfile &&
          userProfile.social &&
          userProfile.social.find(s => s.type === 'twitter')

        return loggedIn ? (
          <Account onClick={() => showModal({ name: EDIT_PROFILE })}>
            {userProfile ? (
              <Username data-testid="userprofile-name">
                {userProfile.username}
              </Username>
            ) : null}
            <Avatar
              src={`https://avatars.io/twitter/${
                twitterProfile ? twitterProfile.value : 'unknowntwitter123abc'
              }/medium`}
            />
          </Account>
        ) : (
          <Button
            type="light"
            onClick={() => showModal({ name: UNIVERSAL_LOGIN })}
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
