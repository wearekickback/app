import React, { Component } from 'react'
import styled from 'react-emotion'

import RSVP from './RSVP'

const CTA = styled('div')``
const RemainingSpots = styled('div')``

class EventCTA extends Component {
  render() {
    const { attendees, limitOfParticipants } = this.props.party
    return (
      <EventCTAContainer>
        <CTA>Join the event.</CTA>
        <RemainingSpots>
          {attendees} going.{' '}
          {parseInt(limitOfParticipants) - parseInt(attendees)} left
        </RemainingSpots>
        <RSVP />
      </EventCTAContainer>
    )
  }
}

const EventCTAContainer = styled('div')``

export default EventCTA
