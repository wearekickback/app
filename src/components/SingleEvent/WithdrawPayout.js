import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
import { WITHDRAW_PAYOUT } from '../../graphql/mutations'

import ChainMutation, { ChainMutationButton } from '../ChainMutation'

const WithdrawPayoutButton = ({ address, className }) => (
  <ChainMutation
    mutation={WITHDRAW_PAYOUT}
    resultKey="withdrawPayout"
    variables={{ address }}
    refetchQueries={[{ query: PARTY_QUERY, variables: { address } }]}
  >
    {(withdrawPayout, result) => (
      <ChainMutationButton
        analyticsId="Withdraw Payout"
        onClick={withdrawPayout}
        result={result}
        className={className}
        preContent={`Withdraw payout`}
      />
    )}
  </ChainMutation>
)

export default WithdrawPayoutButton
