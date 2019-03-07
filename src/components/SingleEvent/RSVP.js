import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import DepositValue from '../Utils/DepositValue'
import { RSVP_TO_EVENT } from '../../graphql/mutations'
import { Going } from './Status'

const RSVP = ({ address, className, deposit }) => (
  <ChainMutation
    mutation={RSVP_TO_EVENT}
    resultKey="rsvp"
    variables={{ address }}
    refetchQueries={[{ query: PARTY_QUERY, variables: { address } }]}
  >
    {(rsvp, result) => (
      <ChainMutationButton
        analyticsId="RSVP"
        onClick={rsvp}
        result={result}
        className={className}
        preContent={<span>RSVP - {DepositValue({ value: deposit })}</span>}
        postContent={<Going>You are going!</Going>}
      />
    )}
  </ChainMutation>
)

export default RSVP
