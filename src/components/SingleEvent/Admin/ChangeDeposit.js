import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Button from '../../Forms/Button'
import DefaultTextInput from '../../Forms/TextInput'
import { toEthVal } from '../../../utils/units'

const CHANGE_DEPOSIT = gql`
  mutation changeDeposit($deposit: Int, $address: String) {
    changeDeposit(deposit: $deposit, address: $address) @client
  }
`

const TextInput = styled(DefaultTextInput)`
  margin-bottom: 10px;
`

const ChangeDeposit = ({ address, currentDeposit, numParticipants }) => {
  const depositToDisplay = toEthVal(currentDeposit)
    .toEth()
    .toFixed(3)

  const [text, setText] = useState('')
  return (
    <ChangeDepositContainer>
      <Mutation mutation={CHANGE_DEPOSIT}>
        {changeDeposit => (
          <>
            <TextInput
              type="text"
              onChangeText={setText}
              placeholder={depositToDisplay}
            />
            <Button
              analyticsId="Change Deposit"
              onClick={() =>
                changeDeposit({
                  variables: {
                    address,
                    deposit: text
                  }
                })
              }
              disabled={numParticipants >= 0}
            >
              Change Deposit
            </Button>
          </>
        )}
      </Mutation>
    </ChangeDepositContainer>
  )
}

const ChangeDepositContainer = styled('div')``

export default ChangeDeposit
