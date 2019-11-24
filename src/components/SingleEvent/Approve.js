import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import { APPROVE_TOKEN } from '../../graphql/mutations'
import { Going } from './Status'
import WarningBox from '../WarningBox'
import Currency from '../SingleEvent/Currency'
import EthVal from 'ethval'

const Approve = ({
  tokenAddress,
  address,
  className,
  deposit,
  decodedDeposit,
  balance,
  isAllowed,
  hasBalance,
  refetch
}) => {
  const denominatedBalance = new EthVal(balance).toEth().toString()
  const denominatedDeposit = new EthVal(decodedDeposit).toEth().toString()

  if (isAllowed && hasBalance) {
    return <Going>You can now RSVP</Going>
  } else if (!hasBalance) {
    return (
      <WarningBox>
        This event requires you to commit {denominatedDeposit}&nbsp;
        <Currency tokenAddress={tokenAddress} />
        &nbsp; but you only have {denominatedBalance}&nbsp;
        <Currency tokenAddress={tokenAddress} /> in your wallet. Please top up
        your wallet and come back again.
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
