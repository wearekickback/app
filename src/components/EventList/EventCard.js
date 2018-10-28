import React, { Component } from 'react'
import styled from 'react-emotion'
import { Link as DefaultLink } from 'react-router-dom'

import DepositValue from '../Utils/DepositValue.js'

const Link = styled(DefaultLink)`
  color: #2b2b2b;
  text-align: left;
`

const EventCardContainer = styled('li')`
  background: #f8f9fb;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  overflow: hidden;
`
const EventImage = styled('img')``

const Date = styled('div')`
  font-family: Muli;
  font-weight: 400;
  font-size: 13px;
  color: #3d3f50;
  line-height: 21px;
`

const EventName = styled('h3')`
  font-family: Muli;
  font-weight: 700;
  font-size: 18px;
  color: #1e1e1e;
  letter-spacing: 0;
  line-height: 25px;
`

const EventDetails = styled('section')`
  padding: 20px;
`

class EventCard extends Component {
  render() {
    const { party } = this.props
    const { address, image, deposit, date, name } = party

    return (
      <EventCardContainer>
        <Link to={`/event/${address}`}>
          <EventImage src={image || 'https://placeimg.com/640/480/tech'} />
          <EventDetails>
            <Date>{date || 'Tuesday, 23rd Sep, 2018 9:00 PM'}</Date>
            <DepositValue value={deposit} />
            <EventName>{name}</EventName>
          </EventDetails>
        </Link>
      </EventCardContainer>
    )
  }
}

export default EventCard
