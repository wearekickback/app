import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'

const EventAttendedContainer = styled('div')``

export default function EventAttended({ event }) {
  console.log('compne', event)
  return (
    <EventAttendedContainer>
      <Link to={`/event/${event.id}`}>{event.name}</Link>
    </EventAttendedContainer>
  )
}
