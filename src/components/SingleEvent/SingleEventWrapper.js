import React, { Component, Fragment } from 'react'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

import {
  amAdmin,
  getMyParticipantEntry,
  getPartyImage
} from '../../utils/parties'
import { PARTY_QUERY, PARTY_QUERY_FROM_GRAPH } from '../../graphql/queries'
import theGraphClient from '../../graphql/thegraph'
import mq from '../../mediaQuery'

import Loader from '../Loader'
import WarningBox from '../WarningBox'
import SafeQuery from '../SafeQuery'
import EventInfo from './EventInfo'
import EventCTA from './EventCTA'
import EventParticipants from './EventParticipants'
import { GlobalConsumer } from '../../GlobalState'

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
  render() {
    const { address } = this.props
    console.log('address', address)
    return (
      <SingleEventContainer>
        <Query client={theGraphClient} query={PARTY_QUERY_FROM_GRAPH}>
          {({ data }) => <div>{JSON.stringify(data)}</div>}
        </Query>
        <GlobalConsumer>
          {({ userAddress }) => (
            <Query
              query={PARTY_QUERY}
              variables={{ address }}
              fetchPolicy="cache-and-network"
              pollInterval={60000}
              keepExistingResultDuringRefetch={true}
            >
              {({ data: { party, partyFromContract }, loading, error }) => {
                console.log(partyFromContract)
                if (!party) {
                  if (loading) {
                    return <Loader />
                  } else {
                    return (
                      <WarningBox>
                        {}
                        {JSON.stringify(error)}
                        We could not find an event at the address {address}!
                      </WarningBox>
                    )
                  }
                }
                // pre-calculate some stuff up here
                const preCalculatedProps = {
                  amAdmin: amAdmin(party, userAddress),
                  myParticipantEntry: getMyParticipantEntry(party, userAddress)
                }
                party.headerImg = getPartyImage(party.headerImg)

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
                        party={party}
                        {...preCalculatedProps}
                      />
                    </RightContainer>
                  </Fragment>
                )
              }}
            </Query>
          )}
        </GlobalConsumer>
      </SingleEventContainer>
    )
  }
}

export default SingleEventWrapper
