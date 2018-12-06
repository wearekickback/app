import React from 'react'
import styled from 'react-emotion'

const EventCardGridContainer = styled('ul')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 30px;
  margin-bottom: 60px;
`

const EventCardGrid = ({ children }) => (
  <EventCardGridContainer>{children}</EventCardGridContainer>
)

export default EventCardGrid
