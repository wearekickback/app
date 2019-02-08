import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'

import Button from '../Forms/Button'
import ProfileForm from '../Profile/ProfileForm'
import { UpdateUserProfile, LoginUser } from '../../graphql/mutations'
import { UserProfileQuery } from '../../graphql/queries'
import SafeMutation from '../SafeMutation'
import SafeQuery from '../SafeQuery'
import { GlobalConsumer } from '../../GlobalState'
import RefreshAuthTokenButton from './RefreshAuthTokenButton'
import { H2 as DefaultH2 } from '../Typography/Basic'
import { ReactComponent as DefaultPencil } from '../svg/Pencil.svg'
import { SIGN_IN } from '../../modals'

const SignInContainer = styled('div')``

const Pencil = styled(DefaultPencil)`
  margin-right: 10px;
`

const H2 = styled(DefaultH2)`
  display: flex;
  align-items: center;
`

export default class SignIn extends Component {
  render() {
    return (
      <SignInContainer data-testid="sign-in-modal">
        <GlobalConsumer>
          {({ userAddress, toggleModal }) => (
            <SafeQuery
              query={UserProfileQuery}
              variables={{ address: userAddress }}
            >
              {result => {
                const hasProfile = !!_.get(result, 'data.profile.username')

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
    return (
      <>
        <H2>
          <Pencil />
          Create account
        </H2>
        <ProfileForm
          userAddress={userAddress}
          renderSubmitButton={(profile, isValid) => (
            <SafeMutation mutation={UpdateUserProfile} variables={{ profile }}>
              {updateUserProfile =>
                isValid ? (
                  <RefreshAuthTokenButton
                    onClick={this.signInOrSignUp({
                      fetchUserProfileFromServer: updateUserProfile,
                      toggleModal
                    })}
                    title="Create account"
                  />
                ) : (
                  <Button type="disabled">Create account</Button>
                )
              }
            </SafeMutation>
          )}
        />
      </>
    )
  }

  renderSignIn(userAddress, toggleModal) {
    return (
      <>
        <H2>Sign in</H2>
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
      </>
    )
  }

  signInOrSignUp = ({
    fetchUserProfileFromServer,
    toggleModal
  }) => async refreshAuthToken => {
    await refreshAuthToken({ fetchUserProfileFromServer })
    toggleModal({ name: SIGN_IN })
  }
}
