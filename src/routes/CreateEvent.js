import React, { Component } from 'react'
import styled from '@emotion/styled'
import { withRouter } from 'react-router-dom'
import SafeQuery from '../components/SafeQuery'
import { GlobalConsumer } from '../GlobalState'
import PartyForm from '../components/SingleEvent/Admin/PartyForm'
import { CREATE_PENDING_PARTY } from '../graphql/mutations'
import { IS_WHITELISTED } from '../graphql/queries'

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
      <GlobalConsumer>
        {({ userAddress }) => {
          return (
            <SafeQuery
              query={IS_WHITELISTED}
              variables={{ address: userAddress || '' }}
            >
              {({ data: { isWhitelisted } }) => {
                if (!isWhitelisted) {
                  return <>To create an event, you have to be whitelisted</>
                }
                return (
                  <CreateContainer>
                    <PartyForm
                      onCompleted={this._onCreated}
                      mutation={CREATE_PENDING_PARTY}
                      variables={{ password }}
                      type="create"
                    ></PartyForm>
                  </CreateContainer>
                )
              }}
            </SafeQuery>
          )
        }}
      </GlobalConsumer>
    )
  }

  _onCreated = ({ id }, deposit, limitOfParticipants, coolingPeriod) => {
    this.props.history.push(
      `/deploy?id=${id}&deposit=${deposit}&limitOfParticipants=${limitOfParticipants}&coolingPeriod=${coolingPeriod}`
    )
  }
}

export default withRouter(Create)
