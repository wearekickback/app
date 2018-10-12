import React from 'react'

import { PartyQuery } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import { RsvpToEvent } from '../../graphql/mutations'
import Going from './Going'

const RSVP = ({ address, className }) => (
  <ChainMutation
    mutation={RsvpToEvent}
    resultKey="rsvp"
    variables={{ address }}
    refetchQueries={[{ query: PartyQuery, variables: { address } }]}
  >
    {(rsvp, result) => (
      <ChainMutationButton
        onClick={rsvp}
        result={result}
        className={className}
        preContent="RSVP"
        postContent={<Going>You are going!</Going>}
      />
    )}
  </ChainMutation>
)

export default RSVP
