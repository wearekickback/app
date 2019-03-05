import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'

import DefaultButton from '../Forms/Button'
import { H2 as DefaultH2 } from '../Typography/Basic'
import ProfileForm from './ProfileForm'
import { UpdateUserProfile } from '../../graphql/mutations'
import SafeMutation from '../SafeMutation'
import SafeQuery from '../SafeQuery'
import { LegalAgreementsQuery } from '../../graphql/queries'
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
          {({ userAddress, userProfile, setUserProfile, toggleModal }) => (
            <>
              <H2>
                <Pencil />
                Edit Profile
              </H2>
              <SafeQuery query={LegalAgreementsQuery}>
                {({ data: { legal: latestLegal } }) => (
                  <ProfileForm
                    userAddress={userAddress}
                    existingProfile={userProfile}
                    latestLegal={latestLegal}
                    renderSubmitButton={(isValid, prepareValuesFn) => (
                      <SafeMutation mutation={UpdateUserProfile}>
                        {updateUserProfile => (
                          <SubmitButton
                            onClick={this.submit({
                              prepareValuesFn,
                              updateUserProfile,
                              setUserProfile,
                              toggleModal
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
    toggleModal
  }) => () => {
    const profile = _.omit(prepareValuesFn(), 'username')

    updateUserProfile({
      variables: { profile }
    }).then(({ data: { profile } }) => {
      setUserProfile(profile)
      toggleModal(EDIT_PROFILE)
    })
  }
}
