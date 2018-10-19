import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'
import { isEmailAddress, isRealName, isTwitterId } from '@noblocknoparty/validation'

import InputAddress from '../Forms/InputAddress'
import DefaultTextInput from '../Forms/TextInput'
import Label from '../Forms/Label'
import Button from '../Forms/Button'
import { H2 as DefaultH2 } from '../Typography/Basic'
import { UpdateUserProfile } from '../../graphql/mutations'
import SafeMutation from '../SafeMutation'
import { trimOrEmptyStringProps } from '../../utils/strings'
import { GlobalConsumer } from '../../GlobalState'
import { EDIT_PROFILE } from '../../modals'
import { ReactComponent as DefaultPencil } from '../svg/Pencil.svg'
import mq from '../../mediaQuery'

const Container = styled('div')``

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
    realName: '',
    twitter: ''
  }

  render() {
    return (
      <Container>
        <GlobalConsumer>
          {({ userAddress, userProfile, toggleModal }) => (
            this.renderForm(userAddress, userProfile, toggleModal)
          )}
        </GlobalConsumer>
      </Container>
    )
  }

  renderForm(userAddress, userProfile, toggleModal) {
    const { email, twitter, realName } = this.state

    const twitterProfile = userProfile &&

    const currentEmail = email || _.get(userProfile, 'email', '')
    const currentTwitter = twitter || _.get(userProfile.social.find(s => s.type === 'twitter'), 'value', '')
    const currentRealName = realName || _.get(userProfile, 'realName', '')

    return (
      <FormDiv>
        <H2>
          <Pencil />
          Edit Profile
        </H2>
        <Label>Ethereum address</Label>
        <div>{userAddress}</div>
        <Label>Username</Label>
        <div>{_.get(userProfile, 'username', '')}</div>
        <Field>
          <Label>Real name</Label>
          <TextInput
            placeholder="realName"
            value={currentRealName}
            onChange={this.handleRealNameChange}
          />
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
            placeholder="jack"
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
    const { email, twitter, username, realName, [TERMS_AND_CONDITIONS]: terms, [PRIVACY_POLICY]: privacy } = this.state

    if (!isUsername(username)) {
      return false
    }

    if (!isRealName(realName)) {
      return false
    }

    if (email && !isEmailAddress(email)) {
      return false
    }

    if (twitter && !isTwitterId(twitter)) {
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
