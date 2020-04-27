import React from 'react'

import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'

function SignInButton() {
  return (
    <GlobalConsumer>
      {({ userProfile, loggedIn, signIn, wallet }) => {
        if (!wallet || (loggedIn && userProfile)) return null
        return (
          <Button type="light" onClick={signIn} analyticsId="Sign In">
            Sign in
          </Button>
        )
      }}
    </GlobalConsumer>
  )
}

export default SignInButton
