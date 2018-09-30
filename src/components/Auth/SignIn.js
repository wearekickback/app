import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import InputAddress from '../Forms/InputAddress'
import TextInput from '../Forms/TextInput'
import Label from '../Forms/Label'
import Button from '../Forms/Button'
import { H2 } from '../Typography/Basic'

const SignInContainer = styled('div')``

const Form = styled('form')``

class SignIn extends PureComponent {
  constructor(props) {
    super(props)
    this.email = null
    this.twitter = null
  }
  signIn = e => {
    e.preventDefault()
    console.log(this.email.value, this.twitter.value)
  }

  render() {
    return (
      <SignInContainer>
        <H2>Please sign in</H2>
        <Form onSubmit={this.signIn}>
          <Label>Ethereum address (public)</Label>
          <InputAddress address="0x866B3c4994e1416B7C738B9818b31dC246b95eEE" />
          <Label>Email: (optional)</Label>
          <TextInput
            placeholder="alice@gmail.com"
            innerRef={input => (this.email = input)}
          />
          <Label>Twitter: (optional)</Label>
          <TextInput
            placeholder="@jack"
            innerRef={input => (this.twitter = input)}
          />
          <Button>Create account</Button>
        </Form>
      </SignInContainer>
    )
  }
}

export default SignIn
