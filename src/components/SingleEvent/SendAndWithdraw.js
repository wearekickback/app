import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
//TODO: update mutation
import { SEND_AND_WITHDRAW_PAYOUT } from '../../graphql/mutations'

import ChainMutation, { ChainMutationButton } from '../ChainMutation'

const canExectute = amounts => {
  return amounts.map(a => parseFloat(a)).filter(a => a > 0).length > 0
}

const SendAndWithdrawButton = ({
  address,
  destinationAddresses,
  destinationAmounts,
  className
}) => (
  <ChainMutation
    mutation={SEND_AND_WITHDRAW_PAYOUT}
    resultKey="sendAndWithdraw"
    variables={{ address, destinationAddresses, destinationAmounts }}
    refetchQueries={[{ query: PARTY_QUERY, variables: { address } }]}
  >
    {(sendAndWithdraw, result) => (
      <ChainMutationButton
        analyticsId="Send and Withdraw Payout"
        onClick={sendAndWithdraw}
        result={result}
        type={!canExectute(destinationAmounts) ? 'disabled' : ''}
        className={className}
        preContent={`Contribute and Withdraw`}
      />
    )}
  </ChainMutation>
)

export default SendAndWithdrawButton
