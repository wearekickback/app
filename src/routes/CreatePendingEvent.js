import React, { Component } from 'react'
import styled from 'react-emotion'
import { withRouter } from 'react-router-dom'

import PartyForm from '../components/SingleEvent/Admin/PartyForm'
import { CreatePendingParty } from '../graphql/mutations'

const CreateContainer = styled('div')`
  display: flex;
  max-width: 800px;
  flex-direction: column;
`

class Create extends Component {
  state = {
    password: ''
  }

  render() {
    const { password } = this.state

    return (
      <CreateContainer>
        <h1>Create a new party</h1>
        <PartyForm
          onCompleted={this._onCreated}
          mutation={CreatePendingParty}
          variables={{ password }}
        >
          <p>
            <label>SECRET PASSWORD:</label>
            <input
              value={password}
              onChange={e => this.setState({ password: e.target.value })}
              type="password"
            />
          </p>
        </PartyForm>
      </CreateContainer>
    )
  }

  _onCreated = ({ id }, deposit, limitOfParticipants, coolingPeriod) => {
    this.props.history.push(
      `/deploy?id=${id}&deposit=${deposit}&limitOfParticipants=${limitOfParticipants}&coolingPeriod=${coolingPeriod}`
    )
  }
}

export default withRouter(Create)
