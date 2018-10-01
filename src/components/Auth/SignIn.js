import _ from 'lodash'
import React, { PureComponent } from 'react'
import styled from 'react-emotion'

import InputAddress from '../Forms/InputAddress'
import TextInput from '../Forms/TextInput'
import Label from '../Forms/Label'
import Button from '../Forms/Button'
import { H2 } from '../Typography/Basic'
import { UpdateUserProfile, LoginUser } from '../../graphql/mutations'
import { UserProfileQuery } from '../../graphql/queries'
import SafeMutation from '../SafeMutation'
import SafeQuery from '../SafeQuery'
import { GlobalConsumer } from '../../GlobalState'
import RefreshAuthToken from './RefreshAuthToken'
import { SIGN_IN } from '../../modals'

const SignInContainer = styled('div')``

const FormDiv = styled('div')``

export default class SignIn extends PureComponent {
  state = {
    email: '',
    twitter: '',
  }

  render() {
    return (
      <SignInContainer>
        <GlobalConsumer>
          {({ userAddress, toggleModal }) => (
            <SafeQuery query={UserProfileQuery} variables={{ address: userAddress }}>
              {data => {
                const hasProfile = !!_.get(data, 'profile.social.length')

                if (hasProfile) {
                  return this.renderSignIn(userAddress, toggleModal)
                } else {
                  return this.renderSignUp(userAddress, toggleModal)
                }
              }}
            </SafeQuery>
          )}
        </GlobalConsumer>
      </SignInContainer>
    )
  }

  renderSignUp (userAddress, toggleModal) {
    const { email, twitter } = this.state

    const social = [
      {
        type: 'twitter',
        value: twitter
      }
    ]

    const legal = [
      {
        type: 'TERMS_AND_CONDITIONS',
        accepted: `${Date.now()}`,
      },
      {
        type: 'PRIVACY_POLICY',
        accepted: `${Date.now()}`,
      },
    ]

    return (
      <FormDiv>
        <H2>Create account</H2>
        <Label>Ethereum address (public)</Label>
        <InputAddress address={userAddress} />
        <Label>Email: (optional)</Label>
        <TextInput
          placeholder="alice@gmail.com"
          value={email}
          onChange={this.handleEmailChange}
        />
        <Label>Twitter: (optional)</Label>
        <TextInput
          placeholder="@jack"
          value={twitter}
          onChange={this.handleTwitterChange}
        />
        <SafeMutation mutation={UpdateUserProfile} variables={{ profile: { email, social, legal } }}>
          {updateUserProfile => (
            <RefreshAuthToken>
              {refreshAuthToken => (
                <Button onClick={this.signInOrSignUp({ refreshAuthToken, fetchUserProfileFromServer: updateUserProfile, toggleModal })}>
                  Create account
                </Button>
              )}
            </RefreshAuthToken>
          )}
        </SafeMutation>
      </FormDiv>
    )
  }

  renderSignIn (userAddress, toggleModal) {
    return (
      <FormDiv>
        <H2>Sign in</H2>
        <Label>Ethereum address</Label>
        <div>{userAddress}</div>
        <SafeMutation mutation={LoginUser}>
          {loginUser => (
            <RefreshAuthToken>
              {refreshAuthToken => (
                <Button onClick={this.signInOrSignUp({ refreshAuthToken, fetchUserProfileFromServer: loginUser, toggleModal })}>
                  Sign in
                </Button>
              )}
            </RefreshAuthToken>
          )}
        </SafeMutation>
      </FormDiv>
    )
  }

  signInOrSignUp = ({ refreshAuthToken, fetchUserProfileFromServer, toggleModal }) => e => {
    e.preventDefault()

    refreshAuthToken({ fetchUserProfileFromServer })
      .then(() => toggleModal(SIGN_IN))
  }

  handleEmailChange = e => {
    this.setState({
      email: e.target.value
    })
  }

  handleTwitterChange = e => {
    this.setState({
      twitter: e.target.value
    })
  }
}
