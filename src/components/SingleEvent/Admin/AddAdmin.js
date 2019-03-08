import React, { useState } from 'react'
import styled from 'react-emotion'
import Button from '../../Forms/Button'
import TextInput from '../../Forms/TextInput'

import ChainMutation, { ChainMutationButton } from '../../ChainMutation'
import { ADD_PARTY_ADMINS } from '../../../graphql/mutations'
import { PARTY_QUERY } from '../../../graphql/queries'

const AddPartyAdminsContainer = styled('div')`
  margin-bottom: 20px;
`

const AddAdminInputContainer = styled('div')`
  display: flex;
  margin-bottom: 20px;
`

const AddAdminInput = styled(TextInput)`
  margin: 0;
  margin-right: 20px;
`

const Add = styled(Button)`
  margin-right: 20px;
`

function AddAdmin({ address }) {
  const [userAddresses, setAddresses] = useState([''])
  const pushAddress = address => setAddresses([...userAddresses, address])
  const setAddress = (index, address) => {
    const newArray = [...userAddresses]
    newArray[index] = address
    setAddresses(newArray)
  }
  const removeAddress = index => {
    const newArray = [...userAddresses].filter((_, i) => index !== i)
    setAddresses(newArray)
  }

  return (
    <ChainMutation
      mutation={ADD_PARTY_ADMINS}
      resultKey="addAdmins"
      variables={{
        address,
        userAddresses: (userAddresses || '').map(s => s.trim())
      }}
      refetchQueries={[{ query: PARTY_QUERY, variables: { address } }]}
      onCompleted={() => this.setState({ userAddresses: null })}
    >
      {(mutate, result) => (
        <AddPartyAdminsContainer>
          {userAddresses.map((address, index) => {
            return (
              <AddAdminInputContainer key={index}>
                <AddAdminInput
                  onChangeText={value => setAddress(index, value)}
                />
                {index > 0 && (
                  <Button onClick={() => removeAddress(index)}>x</Button>
                )}
              </AddAdminInputContainer>
            )
          })}
          <Add onClick={() => pushAddress('')}>+</Add>
          <ChainMutationButton
            analyticsId="AddAdmins"
            onClick={mutate}
            result={result}
            preContent="Confirm admins"
          />
        </AddPartyAdminsContainer>
      )}
    </ChainMutation>
  )
}

export default AddAdmin
