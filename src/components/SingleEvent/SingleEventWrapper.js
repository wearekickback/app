import _ from 'lodash'
import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'

import { addressesMatch } from '../../utils/strings'
import { amInAddressList } from '../../utils/parties'
import { PartyQuery } from '../../graphql/queries'
import SafeQuery from '../SafeQuery'
import EventInfo from './EventInfo'
import EventCTA from './EventCTA'
import EventFilters from './EventFilters'
import EventParticipants from './EventParticipants'
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
            <SafeQuery query={PartyQuery} variables={{ address }} fetchPolicy="cache-and-network">
              {({ party }) => {
                // pre-calculate some stuff up here
                const preCalculatedProps = {
                  amOwner: addressesMatch(_.get(party, 'owner.address', ''), userAddress),
                  myParticipantEntry: userAddress && _.get(party, 'participants', []).find(a => addressesMatch(_.get(a, 'user.address', ''), userAddress)),
                }

                preCalculatedProps.amAdmin = preCalculatedProps.amOwner || (
                  userAddress && amInAddressList(_.get(party, 'admins', []).map(a => a.address), userAddress)
                )

                return (
                  <Fragment>
                    <EventInfoContainer>
                      <EventInfo party={party} address={address} {...preCalculatedProps} />
                    </EventInfoContainer>
                    <RightContainer>
                      <EventCTA
                        party={party}
                        address={address}
                        userAddress={userAddress}
                        {...preCalculatedProps}
                      />
                      <EventFilters handleSearch={handleSearch} {...preCalculatedProps} />
                      <EventParticipants search={search} party={party} {...preCalculatedProps} />
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
