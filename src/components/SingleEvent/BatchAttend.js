import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import GetMarkedAttendedQuery from './GetMarkedAttendedQuery'

const BATCH_ATTEND = gql`
  mutation batchAttend($address: String, $attendees: [String]) {
    batchAttend(address: $address, attendees: $attendees) @client
  }
`

const BatchAttendContainer = styled('div')``

const BatchAttend = ({ address }) => (
  <BatchAttendContainer>
    <GetMarkedAttendedQuery variables={{ contractAddress: address }}>
      {attendees => (
        <Mutation
          mutation={BATCH_ATTEND}
          variables={{
            address,
            attendees
          }}
        >
          {batchAttend => <button onClick={batchAttend}>Batch Attend</button>}
        </Mutation>
      )}
    </GetMarkedAttendedQuery>
  </BatchAttendContainer>
)

export default BatchAttend
