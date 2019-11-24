import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import { depositValue } from '../Utils/DepositValue'
import { RSVP_TO_EVENT } from '../../graphql/mutations'
import { Going } from './Status'
import Button from '../Forms/Button'
import Currency from './Currency'
import styled from 'react-emotion'

const RSVPText = styled(`span`)`
  margin-right: 0.5em;
`

const RSVP = ({
  address,
  tokenAddress,
  className,
  deposit,
  isAllowed,
  hasBalance
}) => {
  const ButtonText = () => {
    return (
      <>
        <RSVPText>RSVP with</RSVPText>
        {depositValue(deposit)} <Currency tokenAddress={tokenAddress} />
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

  if (tokenAddress) {
    return isAllowed && hasBalance ? <ReadyButton /> : <NotReadyButton />
  } else {
    return isAllowed ? <ReadyButton /> : <NotReadyButton />
  }
}

export default RSVP
