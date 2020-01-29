import React from 'react'
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
import { useModalContext } from '../../contexts/ModalContext'

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

export default props => {
  const [, { closeModal }] = useModalContext()

  const submit = ({
    prepareValuesFn,
    updateUserProfile,
    setUserProfile
  }) => () => {
    const profile = prepareValuesFn()

    updateUserProfile({
      variables: { profile }
    }).then(({ data: { profile } }) => {
      setUserProfile(profile)
      closeModal({ name: EDIT_PROFILE })
    })
  }

  return (
    <Container>
      <GlobalConsumer>
        {({ userAddress, userProfile, setUserProfile }) => (
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
                          onClick={submit({
                            prepareValuesFn,
                            updateUserProfile,
                            setUserProfile
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
