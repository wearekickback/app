import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import { APPROVE_TOKEN } from '../../graphql/mutations'
import { Going } from './Status'

const Approve = ({
  tokenAddress,
  address,
  className,
  deposit,
  isAllowed,
  refetch
}) => {
  if (isAllowed) {
    return <Going>You can now RSVP</Going>
  } else {
    return (
      <ChainMutation
        mutation={APPROVE_TOKEN}
        resultKey="approveToken"
        onConfirmed={refetch}
        variables={{ tokenAddress, address, deposit }}
        refetchQueries={[{ query: PARTY_QUERY, variables: { address } }]}
      >
        {(approve, result) => (
          <ChainMutationButton
            analyticsId="Approve"
            onClick={approve}
            result={result}
            className={className}
            preContent={<span>Allow RSVP with Token</span>}
            postContent={<Going>You can now RSVP</Going>}
          />
        )}
      </ChainMutation>
    )
  }
}
export default Approve
