import React, { Component } from 'react'
import styled from 'react-emotion'

import ChainMutation, { ChainMutationButton } from '../../ChainMutation'
import { AddPartyAdmin } from '../../../graphql/mutations'
import { PartyQuery } from '../../../graphql/queries'


const Form = styled('div')``


class AddAdmin extends Component {
  state = {}

  render () {
    const { address } = this.props
    const { userAddress } = this.state

    return (
      <ChainMutation
        mutation={AddPartyAdmin}
        resultKey="addAdmin"
        variables={{ address, userAddress }}
        refetchQueries={[{ query: PartyQuery, variables: { address } }]}
        onCompleted={() => this.setState({ userAddress: null })}
      >
        {(mutate, result) => (
          <Form>
            <label>User:</label>
            <input
              value={userAddress}
              onChange={e => this.setState({ userAddress: e.target.value })}
              type="text"
              placeholder="0x..."
            />
            <ChainMutationButton
              analyticsId='AddAdmin'
              onClick={mutate}
              result={result}
              preContent='Add admin'
            />
          </Form>
        )}
      </ChainMutation>
    )
  }
}

export default AddAdmin
