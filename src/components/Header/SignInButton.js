import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import { GlobalConsumer } from '../../GlobalState'
import Tooltip from '../Tooltip'
import Button from '../Forms/Button'
import Avatar from '../User/Avatar'
import { CANNOT_RESOLVE_ACCOUNT_ADDRESS } from '../../utils/errors'
import Assist from './Assist'
import getWeb3, { getUniversalLogin } from '../../api/web3'

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
  const _signIn = ({
    showTooltip,
    hideTooltip,
    signIn,
    networkState,
    reloadUserAddress
  }) => async () => {
    const universalLogin = await getUniversalLogin()
    const web3 = await getWeb3()

    await universalLogin.create()

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
        const twitterProfile =
          userProfile &&
          userProfile.social &&
          userProfile.social.find(s => s.type === 'twitter')
        return loggedIn && userProfile ? (
          <>
            {/* <Notifications>Notification</Notifications> */}
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
