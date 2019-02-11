import React from 'react'
import styled from 'react-emotion'

import { GlobalConsumer } from '../../GlobalState'
import Tooltip from '../Tooltip'
import Button from '../Forms/Button'
import Avatar from '../User/Avatar'
import { EDIT_PROFILE } from '../../modals'
import { CANNOT_RESOLVE_ACCOUNT_ADDRESS } from '../../utils/errors'

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
  const _signIn = ({
    showTooltip,
    hideTooltip,
    signIn,
    networkState,
    reloadUserAddress
  }) => async () => {
    hideTooltip()

    const address = await reloadUserAddress()

    if (!networkState.allGood || !address) {
      return showTooltip()
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
        toggleModal
      }) => {
        const twitterProfile =
          userProfile && userProfile.social.find(s => s.type === 'twitter')
        return loggedIn ? (
          <>
            {/* <Notifications>Notification</Notifications> */}
            <Account
              onClick={() =>
                toggleModal({
                  name: EDIT_PROFILE
                })
              }
            >
              {userProfile ? <Username>{userProfile.username}</Username> : null}
              <Avatar
                src={`https://avatars.io/twitter/${
                  twitterProfile ? twitterProfile.value : 'unknowntwitter123abc'
                }/medium`}
              />
            </Account>
          </>
        ) : (
          <Tooltip text={CANNOT_RESOLVE_ACCOUNT_ADDRESS} position="left">
            {({ tooltipElement, showTooltip, hideTooltip }) => (
              <Button
                type="light"
                onClick={_signIn({
                  showTooltip,
                  hideTooltip,
                  signIn,
                  reloadUserAddress,
                  networkState
                })}
                analyticsId="Sign In"
              >
                {tooltipElement}
                Sign in
              </Button>
            )}
          </Tooltip>
        )
      }}
    </GlobalConsumer>
  )
}

export default SignInButton
