import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import { GlobalConsumer } from '../../GlobalState'
import Tooltip from '../Tooltip'
import Button from '../Forms/Button'
import Avatar from '../User/Avatar'
import { /*EDIT_PROFILE,*/ WALLET_MODAL } from '../../modals'
import { CANNOT_RESOLVE_ACCOUNT_ADDRESS } from '../../utils/errors'
import TorusButton from './TorusButton'
import LoadingDots from '../Utils/LoadingDots'

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

const SigninLoading = styled('div')`
  display: flex;
  flex-direction: row;
`

function SignInButton() {
  let isSigningIn = false
  const _signIn = ({
    showTooltip,
    hideTooltip,
    signIn,
    networkState,
    reloadUserAddress,
    showModal
  }) => async () => {
    isSigningIn = true
    await reloadUserAddress()
    const walletSelection = window.sessionStorage.getItem('walletSelection')
    if (!walletSelection) {
      showModal({ name: WALLET_MODAL })
    } else {
      let isSignedIn = await signIn()
      if (isSignedIn === false) {
        showModal({ name: WALLET_MODAL })
      }
    }
    isSigningIn = false
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
          userProfile &&
          userProfile.social &&
          userProfile.social.find(s => s.type === 'twitter')
        return loggedIn && userProfile ? (
          <>
            {/* <Notifications>Notification</Notifications> */}
            {/* <LogoutButton /> */}
            <Account to={`/user/${userProfile.username}`}>
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
            <TorusButton />
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
                  networkState,
                  showModal
                })}
                analyticsId="Sign In"
              >
                {tooltipElement}
                {!isSigningIn ? (
                  <div>Sign in</div>
                ) : (
                  <SigninLoading>
                    Sign in
                    <LoadingDots />
                  </SigninLoading>
                )}
              </Button>
            )}
          </Tooltip>
        )
      }}
    </GlobalConsumer>
  )
}

export default SignInButton
