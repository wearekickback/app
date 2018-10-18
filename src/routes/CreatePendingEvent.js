import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import PartyForm from '../components/SingleEvent/Admin/PartyForm'
import { CreatePendingParty } from '../graphql/mutations'

class Create extends Component {
  render() {
    return (
      <>
        <h1>Create a new party</h1>
        <PartyForm
          onCompleted={this._onCreated}
          mutation={CreatePendingParty}
        />
      </>
    )
  }
  _onCreated = ({ id }, deposit, limitOfParticipants) => {
    this.props.history.push(
      `/deploy?id=${id}&deposit=${deposit}&limitOfParticipants=${limitOfParticipants}`
    )
  }

  _buildHandler = ({ createParty, createPendingParty }) => {
    return async () => {
      const result = await createPendingParty()
      const { id } = result
      await createParty({ id })
    }
  }
}

export default withRouter(Create)
