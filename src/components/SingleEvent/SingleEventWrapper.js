import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'

import { PartyQuery } from '../../graphql/queries'
import SafeQuery from '../SafeQuery'
import EventInfo from './EventInfo'
import EventCTA from './EventCTA'
import EventFilters from './EventFilters'
import EventAttendees from './EventAttendees'
import { GlobalConsumer } from '../../GlobalState'

const SingleEventContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto 0;
`

const EventInfoContainer = styled('div')`
  width: 47.5%;
`

const RightContainer = styled('div')`
  width: 47.5%;
`

class SingleEventWrapper extends Component {
  state = {
    search: ''
  }

  handleSearch = event => {
    this.setState({
      search: event.target.value
    })
  }

  render() {
    const { address, handleSearch, search } = this.props
    return (
      <SingleEventContainer>
        <GlobalConsumer>
          {({ userAddress }) => (
            <SafeQuery query={PartyQuery} variables={{ address }}>
              {({ party }) => {
                return (
                  <Fragment>
                    <EventInfoContainer>
                      <EventInfo
                        party={party}
                        address={address}
                        attendees={party.attendees}
                      />
                    </EventInfoContainer>
                    <RightContainer>
                      <EventCTA
                        party={party}
                        address={address}
                        userAddress={userAddress}
                      />
                      <EventFilters handleSearch={handleSearch} />
                      <EventAttendees
                        search={search}
                        party={party}
                        attendees={party.attendees}
                      />
                    </RightContainer>
                  </Fragment>
                )
              }}
            </SafeQuery>
          )}
        </GlobalConsumer>
      </SingleEventContainer>
    )
  }
}

export default SingleEventWrapper
