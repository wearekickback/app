import React, { Component } from 'react'
import styled from 'react-emotion'
import InputAddress from '../Forms/InputAddress'

const SignInContainer = styled('div')``

class SignIn extends Component {
  render() {
    return (
      <SignInContainer>
        Signing in!
        <InputAddress address="0x866B3c4994e1416B7C738B9818b31dC246b95eEE" />
      </SignInContainer>
    )
  }
}

export default SignIn
