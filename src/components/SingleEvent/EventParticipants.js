import React, { Component } from 'react'
import styled from 'react-emotion'

class EventParticipants extends Component {
  render() {
    const { participants } = this.props
    return (
      <EventParticipantsContainer>
        {JSON.stringify(participants)}
      </EventParticipantsContainer>
    )
  }
}

const EventParticipantsContainer = styled('div')``

export default EventParticipants
