import React, { Fragment } from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Button from '../Forms/Button'
import Label from '../Forms/Label'
import TextInput from '../Forms/TextInput'

const SET_LIMIT = gql`
  mutation setLimitOfParticipants($limit: String, $address: String) {
    setLimitOfParticipants(limit: $limit, address: $address) @client
  }
`

const SetLimit = ({ address }) => {
  let input
  return (
    <SetLimitContainer>
      <Mutation mutation={SET_LIMIT}>
        {setLimitOfParticipants => (
          <Fragment>
            <Label>Set Limit</Label>
            <TextInput type="text" ref={element => (input = element)} />
            <Button
              analyticsId="Set Event Limit"
              onClick={() =>
                setLimitOfParticipants({
                  variables: {
                    address,
                    limit: parseInt(input.value)
                  }
                })
              }
            >
              Set Limit
            </Button>
          </Fragment>
        )}
      </Mutation>
    </SetLimitContainer>
  )
}

const SetLimitContainer = styled('div')``

export default SetLimit
