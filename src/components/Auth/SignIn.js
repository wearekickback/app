import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'

import Button from '../Forms/Button'
import ProfileForm from '../Profile/ProfileForm'
import { UPDATE_USER_PROFILE, LOGIN_USER } from '../../graphql/mutations'
import {
  USER_PROFILE_QUERY,
  LEGAL_AGREEMENTS_QUERY
} from '../../graphql/queries'
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

const P = styled('p')`
  white-space: nowrap;
  margin-bottom: 10px;
`

const SignUpButtonDiv = styled('div')`
  margin-top: 30px;
`

export default class SignIn extends Component {
  render() {
    return (
      <SignInContainer data-testid="sign-in-modal">
        <GlobalConsumer>
          {({ userAddress, closeModal }) => (
            <SafeQuery
              query={USER_PROFILE_QUERY}
              variables={{ address: userAddress }}
            >
              {result => {
                const hasProfile = !!_.get(result, 'data.profile.username')

                if (hasProfile) {
                  return this.renderSignIn(userAddress, closeModal)
                } else {
                  return this.renderSignUp(userAddress, closeModal)
                }
              }}
            </SafeQuery>
          )}
        </GlobalConsumer>
      </SignInContainer>
    )
  }

  renderSignUp(userAddress, closeModal) {
    return (
      <>
        <H2>
          <Pencil />
          Create account
        </H2>
        <SafeQuery query={LEGAL_AGREEMENTS_QUERY}>
          {({ data: { legal: latestLegal } }) => (
            <ProfileForm
              userAddress={userAddress}
              latestLegal={latestLegal}
              renderSubmitButton={(isValid, prepareValuesFn) => (
                <SafeMutation mutation={UPDATE_USER_PROFILE}>
                  {updateUserProfile => (
                    <SignUpButtonDiv>
                      {isValid ? (
                        <RefreshAuthTokenButton
                          onClick={this.signInOrSignUp({
                            prepareValuesFn,
                            sendDataToServer: updateUserProfile,
                            closeModal
                          })}
                          title="Create account"
                        />
                      ) : (
                        <Button type="disabled">Create account</Button>
                      )}
                    </SignUpButtonDiv>
                  )}
                </SafeMutation>
              )}
            />
          )}
        </SafeQuery>
      </>
    )
  }

  renderSignIn(userAddress, closeModal) {
    return (
      <>
        <H2>Sign in</H2>
        <P>Account detected: {userAddress}</P>
        <SafeMutation mutation={LOGIN_USER}>
          {loginUser => (
            <RefreshAuthTokenButton
              onClick={this.signInOrSignUp({
                sendDataToServer: loginUser,
                closeModal
              })}
            />
          )}
        </SafeMutation>
      </>
    )
  }

  signInOrSignUp = ({
    prepareValuesFn,
    sendDataToServer,
    closeModal
  }) => async refreshAuthToken => {
    const dataToSend = !prepareValuesFn
      ? undefined
      : {
          variables: {
            profile: prepareValuesFn()
          }
        }

    await refreshAuthToken({
      fetchUserProfileFromServer: () => sendDataToServer(dataToSend)
    })

    this.close(closeModal)
  }

  close = closeModal => {
    closeModal({ name: SIGN_IN })
  }
}
