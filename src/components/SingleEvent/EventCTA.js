import React, { Component } from 'react'
import styled from 'react-emotion'

import RSVP from './RSVP'

const CTA = styled('div')``
const RemainingSpots = styled('div')``

class EventCTA extends Component {
  render() {
    const { attendees, limitOfParticipants, address } = this.props.party
    return (
      <EventCTAContainer>
        <CTA>Join the event.</CTA>
        <RemainingSpots>
          {attendees} going.{' '}
          {parseInt(limitOfParticipants, 10) - parseInt(attendees, 10)} left
        </RemainingSpots>
        <RSVP address={address} />
      </EventCTAContainer>
    )
  }
}

const EventCTAContainer = styled('div')``

export default EventCTA
