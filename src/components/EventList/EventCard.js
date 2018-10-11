import React, { Component } from 'react'
import styled from 'react-emotion'

const EventCardContainer = styled('div')``

class EventCard extends Component {
  render() {
    const { party } = this.props
    return (
      <EventCardContainer>
        {party.deposit}
        {party.image}
        {party.name}
      </EventCardContainer>
    )
  }
}

export default EventCard
