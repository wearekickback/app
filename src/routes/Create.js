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
    date: '',
    image: '',
    deposit: '0.02',
    limitOfParticipants: 20,
  }

  render() {
    const {
      name,
      description,
      location,
      date,
      image,
      deposit,
      limitOfParticipants
    } = this.state

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
          <label>Description</label>
          <input
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="Description of the event"
          /><br/>
          <label>Location</label>
          <input
            value={location}
            onChange={e => this.setState({ location: e.target.value })}
            type="text"
            placeholder="Location of the event"
          /><br/>
          <label>Dates</label>
          <input
            value={date}
            onChange={e => this.setState({ date: e.target.value })}
            type="text"
            placeholder="Dates of the event"
          /><br/>
          <label>Image</label>
          <input
            value={image}
            onChange={e => this.setState({ image: e.target.value })}
            type="text"
            placeholder="URL to image for the event"
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
