import React, { Component } from 'react'
import styled from 'react-emotion'

import DefaultButton from '../Forms/Button'
import { H2 as DefaultH2 } from '../Typography/Basic'
import ProfileForm from './ProfileForm'
import { UPDATE_USER_PROFILE } from '../../graphql/mutations'
import SafeMutation from '../SafeMutation'
import SafeQuery from '../SafeQuery'
import { LEGAL_AGREEMENTS_QUERY } from '../../graphql/queries'
import { GlobalConsumer } from '../../GlobalState'
import { EDIT_PROFILE } from '../../modals'
import { ReactComponent as DefaultPencil } from '../svg/Pencil.svg'

const Container = styled('div')``

const Pencil = styled(DefaultPencil)`
  margin-right: 10px;
`

const H2 = styled(DefaultH2)`
  display: flex;
  align-items: center;
`

const SubmitButton = styled(DefaultButton)`
  margin-top: 30px;
`

export default class EditProfile extends Component {
  state = {
    email: '',
    realName: '',
    twitter: ''
  }

  render() {
    return (
      <Container>
        <GlobalConsumer>
          {({ userAddress, userProfile, setUserProfile, closeModal }) => (
            <>
              <H2>
                <Pencil />
                Edit Profile
              </H2>
              <SafeQuery query={LEGAL_AGREEMENTS_QUERY}>
                {({ data: { legal: latestLegal } }) => (
                  <ProfileForm
                    userAddress={userAddress}
                    existingProfile={userProfile}
                    latestLegal={latestLegal}
                    renderSubmitButton={(isValid, prepareValuesFn) => (
                      <SafeMutation mutation={UPDATE_USER_PROFILE}>
                        {updateUserProfile => (
                          <SubmitButton
                            onClick={this.submit({
                              prepareValuesFn,
                              updateUserProfile,
                              setUserProfile,
                              closeModal
                            })}
                            disabled={!isValid}
                          >
                            Save changes
                          </SubmitButton>
                        )}
                      </SafeMutation>
                    )}
                  />
                )}
              </SafeQuery>
            </>
          )}
        </GlobalConsumer>
      </Container>
    )
  }

  submit = ({
    prepareValuesFn,
    updateUserProfile,
    setUserProfile,
    closeModal
  }) => () => {
    const profile = prepareValuesFn()

    updateUserProfile({
      variables: { profile }
    }).then(({ data: { profile } }) => {
      setUserProfile(profile)
      this.close(closeModal)
    })
  }

  close = closeModal => {
    closeModal({ name: EDIT_PROFILE })
  }
}
