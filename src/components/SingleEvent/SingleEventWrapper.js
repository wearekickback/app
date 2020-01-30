import React from 'react'
import styled from '@emotion/styled'

import {
  amAdmin,
  getMyParticipantEntry,
  getPartyImage
} from '../../utils/parties'
import { PARTY_QUERY } from '../../graphql/queries'
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

const SingleEventWrapper = ({ address }) => {
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
                    <WarningBox>
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
                <>
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
                    <EventParticipants party={party} {...preCalculatedProps} />
                  </RightContainer>
                </>
              )
            }}
          </SafeQuery>
        )}
      </GlobalConsumer>
    </SingleEventContainer>
  )
}

export default SingleEventWrapper
