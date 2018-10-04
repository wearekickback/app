import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '../Forms/Button'

const RSVP_TO_EVENT = gql`
  mutation rsvp($twitter: String, $address: String) {
    rsvp(twitter: $twitter, address: $address) @client
  }
`

const RSVP = ({ address, className }) => (
  <Mutation
    mutation={RSVP_TO_EVENT}
    variables={{
      address,
      twitter: '_jefflau'
    }}
  >
    {rsvp => (
      <Button className={className} onClick={rsvp}>
        RSVP
      </Button>
    )}
  </Mutation>
)

export default RSVP
