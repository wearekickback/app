import React from 'react'

import ChainMutation, { ChainMutationResult } from '../ChainMutation'
import Button from '../Forms/Button'
import { RsvpToEvent } from '../../graphql/mutations'


const RSVP = ({ address, className }) => (
  <ChainMutation
    mutation={RsvpToEvent}
    variables={{ address }}
  >
    {(rsvp, result) => (
      <ChainMutationResult result={result}>
        <Button onClick={rsvp} className={className}>
          RSVP
        </Button>
      </ChainMutationResult>
    )}
  </ChainMutation>
)

export default RSVP
