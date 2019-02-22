import React, { Component } from 'react'

import ChainMutation, { ChainMutationButton } from '../../ChainMutation'
import { AddPartyAdmins } from '../../../graphql/mutations'
import { PartyQuery } from '../../../graphql/queries'

class AddAdmin extends Component {
  state = {}

  render() {
    const { address } = this.props
    const { userAddresses } = this.state

    return (
      <ChainMutation
        mutation={AddPartyAdmins}
        resultKey="addAdmins"
        variables={{
          address,
          userAddresses: (userAddresses || '').split('\n').map(s => s.trim())
        }}
        refetchQueries={[{ query: PartyQuery, variables: { address } }]}
        onCompleted={() => this.setState({ userAddresses: null })}
      >
        {(mutate, result) => (
          <>
            <label>User:</label>
            <textarea
              rows="5"
              onChange={e => this.setState({ userAddresses: e.target.value })}
              type="text"
              placeholder="0x... (one per line)"
            >
              {userAddresses}
            </textarea>
            <ChainMutationButton
              analyticsId="AddAdmins"
              onClick={mutate}
              result={result}
              preContent="Add admins"
            />
          </>
        )}
      </ChainMutation>
    )
  }
}

export default AddAdmin
