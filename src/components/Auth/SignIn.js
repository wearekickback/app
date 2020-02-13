import _ from 'lodash'
import React from 'react'
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
import { useModalContext } from '../../contexts/ModalContext'

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

const RenderSignUp = ({ userAddress, close }) => {
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
                        onClick={signInOrSignUp({
                          prepareValuesFn,
                          sendDataToServer: updateUserProfile,
                          close
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

const RenderSignIn = ({ userAddress, close }) => {
  return (
    <>
      <H2>Sign in</H2>
      <P>Account detected: {userAddress}</P>
      <SafeMutation mutation={LOGIN_USER}>
        {loginUser => (
          <RefreshAuthTokenButton
            onClick={signInOrSignUp({
              sendDataToServer: loginUser,
              close
            })}
          />
        )}
      </SafeMutation>
    </>
  )
}

const signInOrSignUp = ({
  prepareValuesFn,
  sendDataToServer,
  close
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

  close()
}

export default function SignIn(props) {
  const [, { closeModal }] = useModalContext()

  const close = () => {
    closeModal({ name: SIGN_IN })
  }

  return (
    <SignInContainer data-testid="sign-in-modal">
      <GlobalConsumer>
        {({ userAddress }) => (
          <SafeQuery
            query={USER_PROFILE_QUERY}
            variables={{ address: userAddress }}
          >
            {result => {
              const hasProfile = !!_.get(result, 'data.profile.username')

              if (hasProfile) {
                return <RenderSignIn userAddress={userAddress} close={close} />
              } else {
                return <RenderSignUp userAddress={userAddress} close={close} />
              }
            }}
          </SafeQuery>
        )}
      </GlobalConsumer>
    </SignInContainer>
  )
}
