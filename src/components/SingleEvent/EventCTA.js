import React, { PureComponent } from 'react'
import styled from 'react-emotion'

import RSVP from './RSVP'

const CTA = styled('div')``
const RemainingSpots = styled('div')``

class EventCTA extends PureComponent {
  render() {
    const {
      party: { attendees, limitOfParticipants, ended },
      address
    } = this.props

    console.log('EVENT CTA', address)
    return (
      <EventCTAContainer>
        <CTA>Join the event.</CTA>
        <RemainingSpots>
          {attendees} going.{' '}
          {parseInt(limitOfParticipants, 10) - parseInt(attendees, 10)} left
        </RemainingSpots>
        {ended ? 'event has finished' : <RSVP address={address} />}
      </EventCTAContainer>
    )
  }
}

const EventCTAContainer = styled('div')``

export default EventCTA
