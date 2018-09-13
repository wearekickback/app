import React, { Component } from 'react'
import styled from 'react-emotion'

import Participant from './Participant'

class EventParticipants extends Component {
  render() {
    const { participants } = this.props
    return (
      <EventParticipantsContainer>
        {participants.map(participant => (
          <Participant participant={participant} />
        ))}
      </EventParticipantsContainer>
    )
  }
}

const EventParticipantsContainer = styled('div')``

export default EventParticipants
