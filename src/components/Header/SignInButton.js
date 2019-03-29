import React from 'react'
import styled from 'react-emotion'

import { GlobalConsumer } from '../../GlobalState'
import Tooltip from '../Tooltip'
import Button from '../Forms/Button'
import Avatar from '../User/Avatar'
import { EDIT_PROFILE } from '../../modals'
import { CANNOT_RESOLVE_ACCOUNT_ADDRESS } from '../../utils/errors'
import Assist from './Assist'

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
  const _signIn = ({ signIn, networkState, reloadUserAddress }) => async () => {
    await Assist({ expectedNetworkId: networkState.expectedNetworkId })
    const address = await reloadUserAddress()

    if (!networkState.allGood || !address) {
      console.log('not good')
    } else {
      console.log('good')
    }

    signIn()
  }

  return (
    <GlobalConsumer>
      {({
        reloadUserAddress,
        userProfile,
        networkState,
        loggedIn,
        signIn,
        showModal
      }) => {
        const twitterProfile =
          userProfile && userProfile.social.find(s => s.type === 'twitter')
        return loggedIn ? (
          <>
            {/* <Notifications>Notification</Notifications> */}
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
          </>
        ) : (
          <Button
            type="light"
            onClick={_signIn({
              signIn,
              reloadUserAddress,
              networkState
            })}
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
