import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Button from '../../Forms/Button'

const CLEAR = gql`
  mutation clear($address: String) {
    clear(address: $address) @client
  }
`

const Clear = ({ address }) => (
  <ClearContainer>
    <Mutation
      mutation={CLEAR}
      variables={{
        address
      }}
    >
      {clear => (
        <Button analyticsId="Clear Event Pot" onClick={clear}>
          Clear
        </Button>
      )}
    </Mutation>
  </ClearContainer>
)

const ClearContainer = styled('div')``

export default Clear
