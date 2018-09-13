import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const SET_LIMIT = gql`
  mutation setLimitOfParticipants($limit: String, $address: String) {
    setLimitOfParticipants(limit: $limit, address: $address) @client
  }
`

const SetLimit = ({ address }) => (
  <SetLimitContainer>
    <Mutation
      mutation={SET_LIMIT}
      variables={{
        address,
        limit: 1000
      }}
    >
      {setLimitOfParticipants => (
        <button onClick={setLimitOfParticipants}>Set Limit</button>
      )}
    </Mutation>
  </SetLimitContainer>
)

const SetLimitContainer = styled('div')``

export default SetLimit
