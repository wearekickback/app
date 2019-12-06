import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
//TODO: update mutation
import { WITHDRAW_PAYOUT } from '../../graphql/mutations'

import ChainMutation, { ChainMutationButton } from '../ChainMutation'

const SendAndWithdrawButton = ({ addresses, amounts, className }) => (
  <ChainMutation
    mutation={WITHDRAW_PAYOUT}
    resultKey="sendAndWithdrawPayout"
    variables={{ addresses, amounts }}
    refetchQueries={[{ query: PARTY_QUERY, variables: { addresses, amounts } }]}
  >
    {(sendAndWithdrawPayout, result) => (
      <ChainMutationButton
        analyticsId="Send and Withdraw Payout"
        onClick={sendAndWithdrawPayout}
        result={result}
        className={className}
        preContent={`Tip and Withdraw`}
      />
    )}
  </ChainMutation>
)

export default SendAndWithdrawButton
