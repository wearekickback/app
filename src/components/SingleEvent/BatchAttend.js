import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import GetMarkedAttendedQuery from './GetMarkedAttendedQuery'

const BATCH_ATTEND = gql`
  mutation batchAttend($address: String, $participants: [String]) {
    batchAttend(address: $address, participants: $participants) @client
  }
`

const BatchAttendContainer = styled('div')``

const BatchAttend = ({ address }) => (
  <BatchAttendContainer>
    <GetMarkedAttendedQuery variables={{ contractAddress: address }}>
      {participants => (
        <Mutation
          mutation={BATCH_ATTEND}
          variables={{
            address,
            participants
          }}
        >
          {batchAttend => <button onClick={batchAttend}>Batch Attend</button>}
        </Mutation>
      )}
    </GetMarkedAttendedQuery>
  </BatchAttendContainer>
)

export default BatchAttend
