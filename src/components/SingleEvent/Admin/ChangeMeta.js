import React, { useState } from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Button from '../../Forms/Button'
import DefaultTextInput from '../../Forms/TextInput'

const CHANGE_META = gql`
  mutation changeMeta($address: String, $ipfsHash: String) {
    changeMeta(address: $address, ipfsHash: $ipfsHash) @client
  }
`

const TextInput = styled(DefaultTextInput)`
  margin-bottom: 10px;
`

const ChangeMeta = ({ address, ipfsHash }) => {
  console.log({ address, ipfsHash })
  const [text, setText] = useState('')
  return (
    <ChangeMetaContainer>
      <Mutation mutation={CHANGE_META}>
        {changeMeta => (
          <>
            <TextInput type="text" onChangeText={setText} placeholder={''} />
            <Button
              analyticsId="Set Event Limit"
              onClick={() =>
                changeMeta({
                  variables: {
                    ipfsHash,
                    address
                  }
                })
              }
            >
              Change Meta
            </Button>
          </>
        )}
      </Mutation>
    </ChangeMetaContainer>
  )
}

const ChangeMetaContainer = styled('div')``

export default ChangeMeta
