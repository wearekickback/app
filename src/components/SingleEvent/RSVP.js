import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import { RSVP_TO_EVENT } from '../../graphql/mutations'
import { Going } from './Status'
import Button from '../Forms/Button'
import Currency from './Currency'
import styled from '@emotion/styled'
import { isEmptyAddress } from '../../api/utils'

const RSVPText = styled(`span`)`
  margin-right: 0.5em;
`

const RSVP = ({
  address,
  tokenAddress,
  className,
  deposit,
  decimals,
  isAllowed,
  hasBalance
}) => {
  const ButtonText = () => {
    let stepTwo = ''
    if (!isEmptyAddress(tokenAddress) && hasBalance) stepTwo = 'Step 2: '
    return (
      <>
        <RSVPText>{stepTwo}RSVP with</RSVPText>
        <Currency amount={deposit} tokenAddress={tokenAddress} />
      </>
    )
  }

  const NotReadyButton = () => {
    return (
      <Button disabled={true}>
        <ButtonText />
      </Button>
    )
  }

  const ReadyButton = () => {
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
            preContent={<ButtonText />}
            postContent={<Going>You are going!</Going>}
          />
        )}
      </ChainMutation>
    )
  }
  if (!isEmptyAddress(tokenAddress)) {
    return isAllowed && hasBalance ? <ReadyButton /> : <NotReadyButton />
  } else {
    return hasBalance ? <ReadyButton /> : <NotReadyButton />
  }
}

export default RSVP
