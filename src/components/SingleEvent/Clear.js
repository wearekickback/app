import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

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
      {setLimitOfParticipants => (
        <button onClick={setLimitOfParticipants}>Clear</button>
      )}
    </Mutation>
  </ClearContainer>
)

const ClearContainer = styled('div')``

export default Clear
