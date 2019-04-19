import React, { Component } from 'react'
import styled from 'react-emotion'
import { withRouter } from 'react-router-dom'
import DefaultTextInput from '../components/Forms/TextInput'
import Label from '../components/Forms/Label'

import PartyForm from '../components/SingleEvent/Admin/PartyForm'
import { CREATE_PENDING_PARTY } from '../graphql/mutations'

const CreateContainer = styled('div')`
  display: flex;
  max-width: 800px;
  flex-direction: column;
`

const TextInput = styled(DefaultTextInput)`
  margin-bottom: 20px;
`

class Create extends Component {
  state = {
    password: ''
  }

  render() {
    const { password } = this.state

    return (
      <CreateContainer>
        <PartyForm
          onCompleted={this._onCreated}
          mutation={CREATE_PENDING_PARTY}
          variables={{ password }}
          type="create"
        >
          <Label>SECRET PASSWORD:</Label>
          <TextInput
            value={password}
            onChangeText={val => this.setState({ password: val })}
            type="password"
          />
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
