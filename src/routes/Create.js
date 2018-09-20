import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

const CREATE = gql`
  mutation create($name: String, $deposit: String, $limitOfParticipants: String, ) {
    create(name: $name, deposit: $deposit, limitOfParticipants: $limitOfParticipants) @client
  }
`
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

        <Mutation mutation={CREATE} variables={{ name, deposit, limitOfParticipants }}>
          {(postMutation, { data }) => (
            <div>
              <button onClick={postMutation}>Submit</button>
              {data ? (
                <Link to={`/party/${data.create}`}>View party {data.create}</Link>
              ) : null}
            </div>
          )}
        </Mutation>
      </div>
    )
  }
}

export default Create
