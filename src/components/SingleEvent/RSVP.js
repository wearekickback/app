import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import DepositValue from '../Utils/DepositValue'
import { RSVP_TO_EVENT } from '../../graphql/mutations'
import { Going } from './Status'
import Button from '../Forms/Button'

const RSVP = ({ address, className, deposit, isAllowed }) => {
  if (!isAllowed) {
    return <Button disabled={true}>RSVP</Button>
  } else {
    return (
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
            // preContent={<span>RSVP - {DepositValue({ value: deposit })}</span>}
            preContent={<span>RSVP</span>}
            postContent={<Going>You are going!</Going>}
          />
        )}
      </ChainMutation>
    )
  }
}

export default RSVP
