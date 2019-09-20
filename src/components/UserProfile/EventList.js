import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'

const EventAttendedContainer = styled('div')`
  margin-bottom: 10px;
`
const EventLink = styled(Link)``

export default function EventList({ events }) {
  return events.map(event => (
    <EventAttendedContainer key={event.address}>
      <EventLink to={`/event/${event.address}`}>{event.name}</EventLink>
    </EventAttendedContainer>
  ))
}
