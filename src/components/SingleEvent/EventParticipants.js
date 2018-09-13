import React, { Component } from 'react'
import styled from 'react-emotion'

import Participant from './Participant'

class EventParticipants extends Component {
  render() {
    const { participants, search } = this.props
    const searchTerm = search.toLowerCase()
    return (
      <EventParticipantsContainer>
        {participants
          .filter(
            participant =>
              participant.participantName.toLowerCase().includes(searchTerm) ||
              participant.address.toLowerCase().includes(searchTerm)
          )
          .map(participant => (
            <Participant participant={participant} />
          ))}
      </EventParticipantsContainer>
    )
  }
}

const EventParticipantsContainer = styled('div')``

export default EventParticipants
