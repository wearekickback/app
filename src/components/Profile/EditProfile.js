import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'

import Button from '../Forms/Button'
import { H2 as DefaultH2 } from '../Typography/Basic'
import ProfileForm from './ProfileForm'
import { UpdateUserProfile } from '../../graphql/mutations'
import SafeMutation from '../SafeMutation'
import { GlobalConsumer } from '../../GlobalState'
import { EDIT_PROFILE } from '../../modals'
import { ReactComponent as DefaultPencil } from '../svg/Pencil.svg'

const Container = styled('div')``

const FormDiv = styled('div')``

const Pencil = styled(DefaultPencil)`
  margin-right: 10px;
`

const H2 = styled(DefaultH2)`
  display: flex;
  align-items: center;
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
            <FormDiv>
              <H2>
                <Pencil />
                Edit Profile
              </H2>
              <ProfileForm
                userAddress={userAddress}
                existingProfile={userProfile}
                renderSubmitButton={(profile, isValid) => (
                  <SafeMutation
                    mutation={UpdateUserProfile}
                    variables={{
                      profile: _.omit(profile, 'username')
                    }}
                  >
                    {updateUserProfile => (
                      <Button
                        onClick={this.submit({
                          updateUserProfile,
                          setUserProfile,
                          toggleModal
                        })}
                        disabled={!isValid}
                      >
                        Save changes
                      </Button>
                    )}
                  </SafeMutation>
                )}
              />
            </FormDiv>
          )}
        </GlobalConsumer>
      </Container>
    )
  }

  submit = ({ updateUserProfile, setUserProfile, toggleModal }) => () => {
    updateUserProfile().then(({ data: { profile } }) => {
      setUserProfile(profile)
      toggleModal(EDIT_PROFILE)
    })
  }
}
