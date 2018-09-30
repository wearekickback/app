import React, { PureComponent, Fragment } from 'react'
import styled from 'react-emotion'

import { PartyQuery } from '../../graphql/queries'
import SafeQuery from '../SafeQuery'
import EventInfo from './EventInfo'
import EventCTA from './EventCTA'
import EventFilters from './EventFilters'
import EventParticipants from './EventParticipants'

const SingleEventContainer = styled('div')`
  display: flex;
`

const EventInfoContainer = styled('div')`
  width: 50%;
`

const RightContainer = styled('div')`
  width: 50%;
`

class SingleEventWrapper extends PureComponent {
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
        <SafeQuery query={PartyQuery} variables={{ address }}>
          {({ party }) => {
            return (
              <Fragment>
                <EventInfoContainer>
                  <EventInfo party={party} address={address} />
                </EventInfoContainer>
                <RightContainer>
                  <EventCTA party={party} address={address} />
                  <EventFilters handleSearch={handleSearch} />
                  <EventParticipants
                    search={search}
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

export default SingleEventWrapper
