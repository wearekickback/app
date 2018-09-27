import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'

import { PartyQuery } from '../graphql/queries'
import SafeQuery from '../components/SafeQuery'
import EventInfo from '../components/SingleEvent/EventInfo'
import EventCTA from '../components/SingleEvent/EventCTA'
import EventFilters from '../components/SingleEvent/EventFilters'
import EventParticipants from '../components/SingleEvent/EventParticipants'

const SingleEventContainer = styled('div')`
  display: flex;
`

const EventInfoContainer = styled('div')`
  width: 50%;
`

const RightContainer = styled('div')`
  width: 50%;
`

class SingleEvent extends Component {
  state = {
    search: ''
  }

  handleSearch = event => {
    this.setState({
      search: event.target.value
    })
  }

  render() {
    const { address } = this.props.match.params
    return (
      <SingleEventContainer>
        <SafeQuery query={PartyQuery} variables={{ address }}>
          {({ party }) => {
            return (
              <Fragment>
                <EventInfoContainer>
                  <EventInfo party={party} address={address} />
                </EventInfoContainer>
                <RightContainer>
                  <EventCTA party={party} address={address} />
                  <EventFilters handleSearch={this.handleSearch} />
                  <EventParticipants
                    search={this.state.search}
                    party={party}
                    participants={party.participants}
                  />
                </RightContainer>
              </Fragment>
            )
          }}
        </SafeQuery>
      </SingleEventContainer>
    )
  }
}

export default SingleEvent
