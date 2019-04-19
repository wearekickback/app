import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import EthVal from 'ethval'
import { amAdmin, getMyParticipantEntry } from '../../utils/parties'
// import { PARTY_QUERY } from '../../graphql/queries'
import mq from '../../mediaQuery'

// import Loader from '../Loader'
// import ErrorBox from '../ErrorBox'
// import SafeQuery from '../SafeQuery'
import EventInfo from './EventInfo'
import EventCTA from './EventCTA'
import EventParticipants from './EventParticipants'
import { GlobalConsumer } from '../../GlobalState'
import queryString from 'query-string'

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
    // const loading = false
    const data = queryString.parse(window.location.search)
    const party = {
      address: '0x',
      balance: '0x0',
      cancelled: false,
      arriveBy: data.arriveBy,
      coolingPeriod: '0x93a80',
      deposit: new EthVal(data.deposit, 'eth').toWei().toString(16),
      description: data.description,
      participants: [],
      roles: [],
      end: data.end,
      ended: false,
      headerImg: '',
      id: '85c2248f-fc1a-4180-aae3-4314283ec05f',
      location: data.location,
      name: data.name,
      participantLimit: data.limitOfParticipants,
      start: data.start,
      timezone: data.timezone,
      eventType: data.eventType,
      price: parseFloat(data.price),
      eventFee: parseFloat(data.eventFee),
      platformFee: parseFloat(data.platformFee),
      kickback: parseFloat(data.kickback),
      kickback80percent: parseFloat(data.kickback80percent),
      kickback50percent: parseFloat(data.kickback50percent),
      yourReturn: parseFloat(data.yourReturn),
      kickbackReturn: parseFloat(data.kickbackReturn)
    }
    console.log(party)
    return (
      <SingleEventContainer>
        <GlobalConsumer>
          {({ userAddress }) => {
            // pre-calculate some stuff up here
            const address = ''
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
                  <EventParticipants party={party} {...preCalculatedProps} />
                </RightContainer>
              </Fragment>
            )
          }}
        </GlobalConsumer>
      </SingleEventContainer>
    )
  }
}

export default SingleEventWrapper
