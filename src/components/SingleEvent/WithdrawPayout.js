import React from 'react'

import { PartyQuery } from '../../graphql/queries'
import ChainMutation, { ChainMutationResult } from '../ChainMutation'
import Button from '../Forms/Button'
import { WithdrawPayout } from '../../graphql/mutations'


const WithdrawPayoutButton = ({ address, amount, className }) => (
  <ChainMutation
    mutation={WithdrawPayout}
    resultKey='withdrawPayout'
    variables={{ address }}
    refetchQueries={[{ query: PartyQuery, variables: { address }}]}
  >
    {(withdrawPayout, result) => (
      <ChainMutationResult result={result}>
        <Button onClick={withdrawPayout} className={className}>
          Withdraw payout - {amount} ETH
        </Button>
      </ChainMutationResult>
    )}
  </ChainMutation>
)

export default WithdrawPayoutButton
