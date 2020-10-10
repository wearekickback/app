import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Button from '../../Forms/Button'
import DefaultTextInput from '../../Forms/TextInput'

const TextInput = styled(DefaultTextInput)`
  margin-bottom: 10px;
`

const CLEAR_AND_SEND = gql`
  mutation clearAndSend($address: String, $num: String) {
    clearAndSend(address: $address, num: $num) @client
  }
`

const ClearAndSend = ({ address, num }) => {
  const [text, setText] = useState('')
  return (
    <Container>
      <Mutation mutation={CLEAR_AND_SEND}>
        {clearAndSend => (
          <>
            <TextInput type="text" onChangeText={setText} placeholder={num} />

            <Button
              analyticsId="Send Event Pot"
              onClick={() => {
                clearAndSend({
                  variables: {
                    address,
                    num: parseInt(text)
                  }
                })
              }}
            >
              Send to participants
            </Button>
          </>
        )}
      </Mutation>
    </Container>
  )
}

const Container = styled('div')``

export default ClearAndSend
