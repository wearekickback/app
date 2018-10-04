import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import ChainMutation from '../components/ChainMutation'
import { CreateParty } from '../graphql/mutations'
import { extractNewPartyAddressFromTx } from '../api/utils'

class Create extends Component {
  state = {
    name: '',
    deposit: '0.02',
    limitOfParticipants: 20
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
          {(postMutation, { inProgress, percentComplete, complete, tx }) => {
            const address = complete ? extractNewPartyAddressFromTx(tx) : null

            return (
              <div>
                <button onClick={postMutation}>Create</button>
                {inProgress ? (
                  <div>Confirming: {percentComplete}% complete!</div>
                ) : null}
                {address ? (
                  <Link to={`/party/${address}`}>View party {address}</Link>
                ) : null}
              </div>
            )
          }}
        </ChainMutation>
      </div>
    )
  }
}

export default Create
