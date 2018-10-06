import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import ChainMutation, { ChainMutationResult } from '../components/ChainMutation'
import Button from '../components/Forms/Button'
import { CreateParty } from '../graphql/mutations'
import { extractNewPartyAddressFromTx } from '../api/utils'

class Create extends Component {
  state = {
    name: '',
    description: '',
    location: '',
    dates: '',
    deposit: '0.02',
    limitOfParticipants: 20,
  }

  render() {
    const { name, deposit, limitOfParticipants } = this.state
    return (
      <div className="App">
        <h1>Create a new party</h1>
        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
            type="text"
            placeholder="Name of the event"
          /><br/>
          <label>Deposit</label>
          <input
            value={deposit}
            onChange={e => this.setState({ deposit: e.target.value })}
            type="text"
            placeholder="deposits"
          /><br/>
          <label>Limit of participants</label>
          <input
            value={limitOfParticipants}
            onChange={e => this.setState({ limitOfParticipants: e.target.value })}
            type="text"
            placeholder="number of participants"
          /><br/>
        </div>

        <ChainMutation
          mutation={CreateParty}
          resultKey='create'
          variables={{ name, deposit, limitOfParticipants }}
        >
          {(postMutation, result) => {
            const address = result.succeeded ? extractNewPartyAddressFromTx(result.tx) : null

            return (
              <ChainMutationResult result={result}>
                <Button onClick={postMutation}>Create</Button>
                {address ? (
                  <Link to={`/party/${address}`}>View party {address}</Link>
                ) : null}
              </ChainMutationResult>
            )
          }}
        </ChainMutation>
      </div>
    )
  }
}

export default Create
