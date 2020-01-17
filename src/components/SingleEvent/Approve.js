import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import { APPROVE_TOKEN } from '../../graphql/mutations'
import { Going } from './Status'
import WarningBox from '../WarningBox'
import Currency from '../SingleEvent/Currency'

const Approve = ({
  tokenAddress,
  address,
  className,
  deposit,
  decodedDeposit = 0,
  balance = 0,
  decimals,
  isAllowed,
  hasBalance,
  refetch
}) => {
  const canRSVP = isAllowed && hasBalance

  if (canRSVP) {
    return <Going>You can now RSVP</Going>
  } else if (!hasBalance) {
    return (
      <WarningBox>
        This event requires you to commit{' '}
        <Currency amount={decodedDeposit} tokenAddress={tokenAddress} />
        &nbsp; but you only have{' '}
        <Currency amount={balance} tokenAddress={tokenAddress} /> in your
        wallet. Please top up your wallet and come back again.
      </WarningBox>
    )
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
