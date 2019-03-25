import React from 'react'
import styled from 'react-emotion'

import { toPrettyDate } from '../../utils/dates'

const Span = styled('span')`
  font-family: Muli;
  font-weight: 400;
`

const EventDate = ({ event, className }) => (
  <Span className={className}>{toPrettyDate(event.start, event.timezone)}</Span>
)

export default EventDate
