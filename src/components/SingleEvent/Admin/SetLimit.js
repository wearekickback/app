import React, { useState } from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Button from '../../Forms/Button'
import DefaultTextInput from '../../Forms/TextInput'

const SET_LIMIT = gql`
  mutation setLimitOfParticipants($limit: String, $address: String) {
    setLimitOfParticipants(limit: $limit, address: $address) @client
  }
`

const TextInput = styled(DefaultTextInput)`
  margin-bottom: 10px;
`

const SetLimit = ({ address }) => {
  const [text, setText] = useState('')
  return (
    <SetLimitContainer>
      <Mutation mutation={SET_LIMIT}>
        {setLimitOfParticipants => (
          <>
            <TextInput type="text" onChangeText={setText} />
            <Button
              analyticsId="Set Event Limit"
              onClick={() =>
                setLimitOfParticipants({
                  variables: {
                    address,
                    limit: parseInt(text)
                  }
                })
              }
            >
              Set Limit
            </Button>
          </>
        )}
      </Mutation>
    </SetLimitContainer>
  )
}

const SetLimitContainer = styled('div')``

export default SetLimit
