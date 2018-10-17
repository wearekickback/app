import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'

import InputAddress from '../Forms/InputAddress'
import DefaultTextInput from '../Forms/TextInput'
import Label from '../Forms/Label'
import Button from '../Forms/Button'
import { H2 as DefaultH2 } from '../Typography/Basic'
import { UpdateUserProfile, LoginUser } from '../../graphql/mutations'
import { UserProfileQuery } from '../../graphql/queries'
import SafeMutation from '../SafeMutation'
import SafeQuery from '../SafeQuery'
import { trimOrEmptyStringProps } from '../../utils/strings'
import { GlobalConsumer } from '../../GlobalState'
import RefreshAuthTokenButton from './RefreshAuthTokenButton'
import { SIGN_IN } from '../../modals'
import {
  TERMS_AND_CONDITIONS,
  PRIVACY_POLICY,
  MARKETING_INFO
} from '../../utils/legal'
import { ReactComponent as DefaultPencil } from '../svg/Pencil.svg'
import mq from '../../mediaQuery'

const SignInContainer = styled('div')``

const FormDiv = styled('div')``

const Pencil = styled(DefaultPencil)`
  margin-right: 10px;
`

const H2 = styled(DefaultH2)`
  display: flex;
  align-items: center;
`

const Field = styled('div')`
  margin: 30px 0;
`

const Explanation = styled('div')`
  color: #999;
  font-size: 80%;
  margin-top: 7px;
`

const TextInput = styled(DefaultTextInput)`
  margin-bottom: 0;
  width: 100%;

  ${mq.medium`
    width: 80%;
  `};
`

export default class SignIn extends Component {
  state = {
    email: '',
    username: '',
    realName: '',
    twitter: ''
  }

  render() {
    return (
      <SignInContainer>
        <GlobalConsumer>
          {({ userAddress, toggleModal }) => (
            <SafeQuery
              query={UserProfileQuery}
              variables={{ address: userAddress }}
            >
              {result => {
                const hasProfile = !!_.get(result, 'data.profile.social.length')

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

  renderSignUp(userAddress, toggleModal) {
    const { email, twitter, realName, username } = this.state

    const social = [
      {
        type: 'twitter',
        value: twitter
      }
    ]

    const accepted = `${Date.now()}`
    const legal = [TERMS_AND_CONDITIONS, PRIVACY_POLICY, MARKETING_INFO].reduce(
      (m, v) => {
        if (this.state[v]) {
          m.push({
            type: v,
            accepted
          })
        }
        return m
      },
      []
    )

    return (
      <FormDiv>
        <H2>
          <Pencil />
          Create account
        </H2>
        <Label>Ethereum address</Label>
        <InputAddress address={userAddress} />
        <Field>
          <Label>Username</Label>
          <TextInput
            placeholder="username"
            value={username}
            onChange={this.handleUsernameChange}
          />
          <Explanation>
            We hope this will be easier to remember than your account address (0x...)!
          </Explanation>
        </Field>
        <Field>
          <Label>Real name</Label>
          <TextInput
            placeholder="Joe Bloggs"
            value={realName}
            onChange={this.handleRealNameChange}
          />
          <Explanation>
            <strong>This stays private.</strong>. We only share this with
            organizers of the events you attend, so that they can identify
            you on arrival.
          </Explanation>
        </Field>
        <Field>
          <Label optional>Email</Label>
          <TextInput
            placeholder="alice@gmail.com"
            value={email}
            onChange={this.handleEmailChange}
          />
          <Explanation>
            This allows us to notify you of any changes to the event and
            remind you when it's time to withdraw your payout. We don't
            share this with anyone (not even event organizers).
          </Explanation>
        </Field>
        <Field>
          <Label optional>Twitter</Label>
          <TextInput
            placeholder="@jack"
            value={twitter}
            onChange={this.handleTwitterChange}
          />
          <Explanation>
            We use this for your profile picture, and for people to contact
            your over social media if they so wish.
          </Explanation>
        </Field>
        <p>
          <input
            type="checkbox"
            value={TERMS_AND_CONDITIONS}
            checked={!!this.state[TERMS_AND_CONDITIONS]}
            onChange={this.handleTermsCheck}
          />{' '}
          I agree with the <a href={`/terms`} target="_blank">terms and conditions</a>
        </p>
        <p>
          <input
            type="checkbox"
            value={PRIVACY_POLICY}
            checked={!!this.state[PRIVACY_POLICY]}
            onChange={this.handlePrivacyCheck}
          />{' '}
          I agree with the{' '}
          <a href={`/privacy`} target="_blank">
            privacy policy
          </a>
        </p>
        <p>
          <input
            type="checkbox"
            value={MARKETING_INFO}
            checked={!!this.state[MARKETING_INFO]}
            onChange={this.handleMarketingCheck}
          />{' '}
          I am happy to receive marketing info (optional)
        </p>
        <SafeMutation
          mutation={UpdateUserProfile}
          variables={{ profile: {
            ...trimOrEmptyStringProps({ email, realName, username }),
            social,
            legal,
          } }}
        >
          {updateUserProfile => (
            this.inputIsValid() ? (
              <RefreshAuthTokenButton
                onClick={this.signInOrSignUp({
                  fetchUserProfileFromServer: updateUserProfile,
                  toggleModal
                })}
                title='Create account'
              />
            ) : (
              <Button type="disabled">Create account</Button>
            )
          )}
        </SafeMutation>
      </FormDiv>
    )
  }

  inputIsValid () {
    const { username, realName, [TERMS_AND_CONDITIONS]: terms, [PRIVACY_POLICY]: privacy } = this.state

    if (!username) {
      return false
    }
    if (!(/^[A-Za-z0-9_]{2,32}$/.test(username))) {
      return false
    }

    if (!realName) {
      return false
    }
    if (!(/^[^0-9]{2,48}$/.test(realName))) {
      return false
    }

    if (!terms) {
      return false
    }

    if (!privacy) {
      return false
    }

    return true
  }

  renderSignIn(userAddress, toggleModal) {
    return (
      <FormDiv>
        <H2>Sign in</H2>
        <Label>Ethereum address</Label>
        <div>{userAddress}</div>
        <SafeMutation mutation={LoginUser}>
          {loginUser => (
            <RefreshAuthTokenButton
              onClick={this.signInOrSignUp({
                fetchUserProfileFromServer: loginUser,
                toggleModal
              })}
            />
          )}
        </SafeMutation>
      </FormDiv>
    )
  }

  signInOrSignUp = ({
    fetchUserProfileFromServer,
    toggleModal
  }) => refreshAuthToken => {
    refreshAuthToken({ fetchUserProfileFromServer }).then(() => toggleModal(SIGN_IN))
  }

  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    })
  }

  handleRealNameChange = e => {
    this.setState({
      realName: e.target.value
    })
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

  handleTermsCheck = e => {
    this.setState({
      [TERMS_AND_CONDITIONS]: e.target.checked
    })
  }

  handlePrivacyCheck = e => {
    this.setState({
      [PRIVACY_POLICY]: e.target.checked
    })
  }

  handleMarketingCheck = e => {
    this.setState({
      [MARKETING_INFO]: e.target.checked
    })
  }
}
