import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const RSVP_TO_EVENT = gql`
  mutation rsvp($twitter: String, $address: String) {
    rsvp(twitter: $twitter, address: $address) @client
  }
`

const RSVP = ({ address }) => (
  <RSVPContainer>
    <Mutation
      mutation={RSVP_TO_EVENT}
      variables={{
        address,
        twitter: '_jefflau'
      }}
    >
      {rsvp => <button onClick={rsvp}>rsvp</button>}
    </Mutation>
  </RSVPContainer>
)

const RSVPContainer = styled('div')``

export default RSVP
