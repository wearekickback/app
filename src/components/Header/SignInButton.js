import React from 'react'

import { GlobalConsumer } from '../../GlobalState'
import Tooltip from '../Tooltip'
import Button from '../Forms/Button'
import { CANNOT_RESOLVE_ACCOUNT_ADDRESS } from '../../utils/errors'
import Assist from './Assist'

const SignInButton = ({ children, type, ...props }) => {
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
      {({ reloadUserAddress, networkState, signIn, showModal }) => (
        <Tooltip text={CANNOT_RESOLVE_ACCOUNT_ADDRESS} position="left">
          {({ tooltipElement, showTooltip, hideTooltip }) => (
            <Button
              {...props}
              type={type}
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
              {children || 'Sign In'}
            </Button>
          )}
        </Tooltip>
      )}
    </GlobalConsumer>
  )
}

export default SignInButton
