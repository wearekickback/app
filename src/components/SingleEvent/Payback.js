import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const PAYBACK = gql`
  mutation payback($address: String) {
    payback(address: $address) @client
  }
`

const PayBack = ({ address }) => (
  <PayBackContainer>
    <Mutation
      mutation={PAYBACK}
      variables={{
        address
      }}
    >
      {setLimitOfParticipants => (
        <button onClick={setLimitOfParticipants}>PayBack</button>
      )}
    </Mutation>
  </PayBackContainer>
)

const PayBackContainer = styled('div')``

export default PayBack
