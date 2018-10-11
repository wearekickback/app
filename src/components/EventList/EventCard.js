import React, { Component } from 'react'
import styled from 'react-emotion'
import DepositValue from '../DepositValue.js'

const EventCardContainer = styled('div')``

class EventCard extends Component {
  render() {
    const { party } = this.props
    return (
      <EventCardContainer>
        <DepositValue value={party.deposit} />
        {party.image}
        {party.name}
      </EventCardContainer>
    )
  }
}

export default EventCard
