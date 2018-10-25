import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import { addressesMatch } from '@noblocknoparty/shared'

import { amInAddressList } from '../../utils/parties'
import { PartyQuery } from '../../graphql/queries'
import ErrorBox from '../ErrorBox'
import SafeQuery from '../SafeQuery'
import EventInfo from './EventInfo'
import EventCTA from './EventCTA'
import EventParticipants from './EventParticipants'
import { GlobalConsumer } from '../../GlobalState'
import mq from '../../mediaQuery'

const SingleEventContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto 0;
  flex-direction: column;
  ${mq.medium`
    flex-direction: row;
  `};
`

const EventInfoContainer = styled('div')`
  width: 100%;
  ${mq.medium`
    width: 47.5%;
  `};
`

const RightContainer = styled('div')`
  width: 100%;
  ${mq.medium`
    width: 47.5%;
  `};
`

class SingleEventWrapper extends Component {
  state = {
    search: '',
    selectedFilter: null
  }

  handleFilterChange = selectedFilter => {
    this.setState({ selectedFilter })
  }

  handleSearch = event => {
    this.setState({
      search: event.target.value
    })
  }

  render() {
    const { address } = this.props
    const { search, selectedFilter } = this.state

    return (
      <SingleEventContainer>
        <GlobalConsumer>
          {({ userAddress }) => (
            <SafeQuery
              query={PartyQuery}
              variables={{ address }}
              fetchPolicy="cache-and-network"
              pollInterval={60000}
            >
              {({ data: { party }, loading }) => {
                // no party?
                if (!party) {
                  if (loading) {
                    return 'Loading ...'
                  } else {
                    return (
                      <ErrorBox>
                        We could not find an event at the address {address}!
                      </ErrorBox>
                    )
                  }
                }

                // pre-calculate some stuff up here
                const preCalculatedProps = {
                  amOwner: addressesMatch(
                    _.get(party, 'owner.address', ''),
                    userAddress
                  ),
                  myParticipantEntry:
                    userAddress &&
                    _.get(party, 'participants', []).find(a =>
                      addressesMatch(_.get(a, 'user.address', ''), userAddress)
                    )
                }

                preCalculatedProps.amAdmin =
                  preCalculatedProps.amOwner ||
                  (userAddress &&
                    amInAddressList(
                      _.get(party, 'admins', []).map(a => a.address),
                      userAddress
                    ))

                return (
                  <Fragment>
                    <EventInfoContainer>
                      <EventInfo
                        party={party}
                        address={address}
                        {...preCalculatedProps}
                      />
                    </EventInfoContainer>
                    <RightContainer>
                      <EventCTA
                        party={party}
                        address={address}
                        userAddress={userAddress}
                        {...preCalculatedProps}
                      />
                      <EventParticipants
                        handleSearch={this.handleSearch}
                        handleFilterChange={this.handleFilterChange}
                        selectedFilter={this.state.selectedFilter}
                        search={search}
                        party={party}
                        {...preCalculatedProps}
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
