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

const Row = styled('div')`
  display: flex;
  align-items: center;
  flex-direction: column;

  ${mq.medium`
    flex-direction: row;
    justify-content: space-between;
  `};
`

const Column = styled('div')`
  width: 100%;

  ${mq.medium`
    width: 50%;
  `};
`

const Block = styled('div')``

const TextInput = styled(DefaultTextInput)``

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
        <Label secondaryText="(public)">Ethereum address</Label>
        <InputAddress address={userAddress} />
        <Row>
          <Column>
            <Label>Username</Label>
            <TextInput
              placeholder="username"
              value={username}
              onChange={this.handleUsernameChange}
            />
          </Column>
          <Column>
            <Label>Real name</Label>
            <TextInput
              placeholder="Joe Bloggs"
              value={realName}
              onChange={this.handleRealNameChange}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Label>Email</Label>
            <TextInput
              placeholder="alice@gmail.com"
              value={email}
              onChange={this.handleEmailChange}
            />
          </Column>
          <Column>
            <Label secondaryText="(optional)">Twitter</Label>
            <TextInput
              placeholder="@jack"
              value={twitter}
              onChange={this.handleTwitterChange}
            />
          </Column>
        </Row>
        <Block>
          <p>
            <strong>
              Please note, your payment for an event is non-refundable if:
            </strong>
          </p>
          <ul>
            <li>
              You <a href={`/faq`}>RSVP</a> to an event but then don't turn up.
            </li>
            <li>
              You fail to withdraw your post-event payout within the{' '}
              <a href={`/faq`}>cooling period</a>.
            </li>
          </ul>
        </Block>
        <p>
          <input
            type="checkbox"
            value={TERMS_AND_CONDITIONS}
            checked={!!this.state[TERMS_AND_CONDITIONS]}
            onChange={this.handleTermsCheck}
          />{' '}
          I agree with the{' '}
          <a href={`/terms`} target="_blank">
            terms and conditions
          </a>
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
          variables={{ profile: { email, social, legal, realName, username } }}
        >
          {updateUserProfile => (
            this.state.username &&
            this.state.realName &&
            this.state[TERMS_AND_CONDITIONS] &&
            this.state[PRIVACY_POLICY] ? (
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
