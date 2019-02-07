import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'

import { amAdmin, getMyParticipantEntry } from '../../utils/parties'
import { PARTY_QUERY } from '../../graphql/queries'
import mq from '../../mediaQuery'

import Loader from '../Loader'
import ErrorBox from '../ErrorBox'
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

    return (
      <SingleEventContainer>
        <GlobalConsumer>
          {({ userAddress }) => (
            <SafeQuery
              query={PARTY_QUERY}
              variables={{ address }}
              fetchPolicy="cache-and-network"
              pollInterval={60000}
              keepExistingResultDuringRefetch={true}
            >
              {({ data: { party }, loading }) => {
                // no party?
                if (!party) {
                  if (loading) {
                    return <Loader />
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
                  amAdmin: amAdmin(party, userAddress),
                  myParticipantEntry: getMyParticipantEntry(party, userAddress)
                }

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
            </SafeQuery>
          )}
        </GlobalConsumer>
      </SingleEventContainer>
    )
  }
}

export default SingleEventWrapper
