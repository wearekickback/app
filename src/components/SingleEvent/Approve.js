import React from 'react'
import styled from '@emotion/styled'
import { PARTY_QUERY } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import { APPROVE_TOKEN } from '../../graphql/mutations'
import { Going } from './Status'
import WarningBox from '../WarningBox'
import Currency from '../SingleEvent/Currency'
import { GlobalConsumer } from '../../GlobalState'
const WarningWrapper = styled('div')`
  margin: 1em;
`

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
  refetch,
  userAddress
}) => {
  const canRSVP = isAllowed && hasBalance

  if (canRSVP) {
    return <Going>You can now RSVP</Going>
  } else if (!userAddress) {
    return (
      <WarningWrapper>
        <WarningBox>
          We cannot read your wallet balance. Please Connect to your wallet
          first.
        </WarningBox>
      </WarningWrapper>
    )
  } else if (!hasBalance) {
    return (
      <GlobalConsumer>
        {({ wallet }) => {
          return (
            <WarningBox>
              <p>
                This event requires you to commit{' '}
                <Currency amount={decodedDeposit} tokenAddress={tokenAddress} />
                &nbsp; but you only have{' '}
                <Currency amount={balance} tokenAddress={tokenAddress} /> in
                your wallet. Please top up your wallet and come back again.
                <br />
                To bridge from Ethereum mainnet, please use{' '}
                <a href="https://dai-bridge.poa.network">the Mainnet bridge</a>.
                <br />
                If you have DAI on BSC or Matic/Polygon, please use{' '}
                <a href="https://www.xpollinate.io">the Crosschain bridge</a>
              </p>

              {wallet && wallet.url && (
                <p>
                  You're currently connected to {wallet.name}. Click{' '}
                  <a
                    href={wallet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </a>{' '}
                  to top up.
                </p>
              )}
            </WarningBox>
          )
        }}
      </GlobalConsumer>
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
            preContent={<span>Step 1: Allow RSVP with Token</span>}
            postContent={<Going>You can now RSVP</Going>}
          />
        )}
      </ChainMutation>
    )
  }
}
export default Approve
