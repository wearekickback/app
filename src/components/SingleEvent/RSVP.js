import React from 'react'

import { PartyQuery } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import DepositValue from '../Utils/DepositValue'
import { RsvpToEvent } from '../../graphql/mutations'
import { Going } from './Status'

const RSVP = ({ address, className, deposit }) => (
  <ChainMutation
    mutation={RsvpToEvent}
    resultKey="rsvp"
    variables={{ address }}
    refetchQueries={[{ query: PartyQuery, variables: { address } }]}
  >
    {(rsvp, result) => (
      <ChainMutationButton
        analyticsId="RSVP"
        onClick={rsvp}
        result={result}
        className={className}
        preContent={`RSVP - ${DepositValue({ value: deposit })} ETH`}
        postContent={<Going>You are going!</Going>}
      />
    )}
  </ChainMutation>
)

export default RSVP
