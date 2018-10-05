import React, { Component } from 'react'
import styled from 'react-emotion'

import DefaultRSVP from './RSVP'

const CTA = styled('div')`
  font-family: Overpass;
  font-weight: 500;
  font-size: 13px;
  color: #3d3f50;
  letter-spacing: 0;
  margin-bottom: 35px;
`
const RemainingSpots = styled('div')``
const RSVPContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`
const Deposit = styled('div')`
  font-family: Overpass;
  font-weight: 500;
  font-size: 13px;
  color: #6e76ff;
  letter-spacing: 0;
  text-align: center;
  line-height: 21px;
  padding: 10px 20px;
  width: 100px;
  background: rgba(233, 234, 255, 0.5);
  border-radius: 4px;
`

const Going = styled('div')`
  background-color: #6e76ff;
  border-radius: 4px;
  border: 1px solid #6e76ff;
  font-size: 14px;
  font-family: Muli;
  padding: 10px 20px;
  color: white;
  width: calc(100% - 120px);
  text-align: center;
`

const RSVP = styled(DefaultRSVP)`
  width: calc(100% - 120px);
`

class EventCTA extends Component {
  render() {
    const {
      party: { attendees, limitOfParticipants, deposit, ended },
      address,
      participants = [],
      userAddress
    } = this.props

    const going =
      userAddress && participants.find(e => e.address === userAddress)

    console.log('EVENT CTA', address)
    return (
      <EventCTAContainer>
        <RSVPContainer>
          <Deposit>{deposit} ETH</Deposit>
          {userAddress && !ended ? (
            going ? (
              <Going>You're going!</Going>
            ) : (
              <RSVP address={address} />
            )
          ) : (
            ''
          )}
        </RSVPContainer>
        {ended ? (
          <CTA>This meetup is past. 114 people went this event.</CTA>
        ) : (
          <CTA>Join the event.</CTA>
        )}
        {!ended && (
          <RemainingSpots>
            {attendees} going.{' '}
            {parseInt(limitOfParticipants, 10) - parseInt(attendees, 10)} spot
            {parseInt(limitOfParticipants, 10) - parseInt(attendees, 10) === 1
              ? ''
              : 's'}{' '}
            left!
          </RemainingSpots>
        )}
      </EventCTAContainer>
    )
  }
}

const EventCTAContainer = styled('div')``

export default EventCTA
