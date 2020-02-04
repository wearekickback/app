import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import { GlobalConsumer } from '../../GlobalState'
import Tooltip from '../Tooltip'
import Button from '../Forms/Button'
import TwitterAvatar from '../User/TwitterAvatar'
import { CANNOT_RESOLVE_ACCOUNT_ADDRESS } from '../../utils/errors'
import Assist from './Assist'

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

function SignInButton() {
  const _signIn = ({
    showTooltip,
    hideTooltip,
    signIn,
    networkState,
    reloadUserAddress
  }) => async () => {
    hideTooltip()
    let assist = await Assist({
      action: 'Sign in',
      expectedNetworkId: networkState.expectedNetworkId
    })
    const address = await reloadUserAddress()
    if (!networkState.allGood || !address) {
      if (assist.fallback) {
        return showTooltip()
      }
    } else {
      signIn()
    }
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
        return loggedIn && userProfile ? (
          <>
            {/* <Notifications>Notification</Notifications> */}
            <Account to={`/user/${userProfile.username}`}>
              <Username data-testid="userprofile-name">
                {userProfile.username}
              </Username>
              <TwitterAvatar user={userProfile} size={10} scale={4} />
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
