import React from 'react'

import { PARTY_QUERY } from '../../graphql/queries'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import DepositValue from '../Utils/DepositValue'
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
  userAddress
}) => {
  const ButtonText = () => {
    return (
      <>
        <RSVPText>RSVP with</RSVPText>
        {DepositValue({ value: deposit })}
        <Currency tokenAddress={tokenAddress} />
      </>
    )
  }

  if (!isAllowed) {
    return (
      <Button disabled={true}>
        <ButtonText />
      </Button>
    )
  } else {
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
            userAddress={userAddress}
            className={className}
            preContent={<ButtonText />}
            postContent={<Going>You are going!</Going>}
          />
        )}
      </ChainMutation>
    )
  }
}

export default RSVP
