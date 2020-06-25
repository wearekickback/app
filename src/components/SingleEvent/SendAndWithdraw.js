import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
import { SEND_AND_WITHDRAW_PAYOUT } from '../../graphql/mutations'

import ChainMutation, { ChainMutationButton } from '../ChainMutation'

const SendAndWithdrawButton = ({ address, addresses, values, className }) => (
  <ChainMutation
    mutation={SEND_AND_WITHDRAW_PAYOUT}
    resultKey="sendAndWithdrawPayout"
    variables={{ address, addresses, values }}
    refetchQueries={[
      { query: PARTY_QUERY, variables: { address, addresses, values } }
    ]}
  >
    {(sendAndWithdrawPayout, result) => {
      return (
        <ChainMutationButton
          analyticsId="Send and Withdraw Payout"
          onClick={sendAndWithdrawPayout}
          result={result}
          className={className}
          preContent={`Contribute and Withdraw`}
        />
      )
    }}
  </ChainMutation>
)

export default SendAndWithdrawButton
