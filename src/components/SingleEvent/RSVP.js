import React from 'react'

import { PartyQuery } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import { RsvpToEvent } from '../../graphql/mutations'

const RSVP = ({ address, className }) => (
  <ChainMutation
    mutation={RsvpToEvent}
    resultKey="rsvp"
    variables={{ address }}
    refetchQueries={[{ query: PartyQuery, variables: { address } }]}
  >
    {(rsvp, result) => (
      <ChainMutationButton onClick={rsvp} result={result} className={className}
        title='RSVP'
      />
    )}
  </ChainMutation>
)

export default RSVP
