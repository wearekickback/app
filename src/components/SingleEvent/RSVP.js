import React from 'react'
import { Mutation } from 'react-apollo'

import Button from '../Forms/Button'
import { RsvpToEvent } from '../../graphql/mutations'


const RSVP = ({ address, className }) => (
  <Mutation
    mutation={RsvpToEvent}
    variables={{ address }}
  >
    {rsvp => (
      <Button className={className} onClick={rsvp}>
        RSVP
      </Button>
    )}
  </Mutation>
)

export default RSVP
