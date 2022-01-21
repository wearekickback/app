import React, { Component } from 'react'
import LazyLoad from 'react-lazyload'
import styled from '@emotion/styled'
import { Link as DefaultLink } from 'react-router-dom'

import DefaultEventDate from '../Utils/EventDate.js'
import Currency from '../SingleEvent/Currency'

const Link = styled(DefaultLink)`
  color: #2b2b2b;
  text-align: left;
`

const EventCardContainer = styled('li')`
  background: ${props => (props.private ? '#e9e9e9' : '#f8f9fb')};
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  overflow: hidden;
`
const EventImage = styled('img')``

const EventDate = styled(DefaultEventDate)`
  font-family: Muli;
  font-weight: 500;
  font-size: 13px;
  color: #3d3f50;
  line-height: 21px;
  display: block;
  margin-top: 5px;
  margin-bottom: 20px;
`

const EventName = styled('h3')`
  font-family: Muli;
  font-weight: 700;
  font-size: 18px;
  color: #1e1e1e;
  letter-spacing: 0;
  line-height: 25px;
  margin: 0;
`

const EventDetails = styled('section')`
  padding: 20px;
`

const Deposit = styled('span')`
  font-size: 11px;
  font-style: italic;
`

const Private = styled(`span`)`
  margin-left: 5px;
  font-weight: bold;
`

class EventCard extends Component {
  render() {
    const { party } = this.props
    const { address, headerImg, deposit, name, tokenAddress, status } = party
    return (
      <EventCardContainer private={party.status === 'private'}>
        <Link to={`/event/${address}`}>
          {party.status === 'private' && <Private>Private</Private>}

          <LazyLoad height={300}>
            <EventImage
              src={headerImg || 'https://placeimg.com/640/480/tech'}
            />
          </LazyLoad>
          <EventDetails>
            <EventName>{name}</EventName>
            <EventDate event={party} />
            <Deposit>
              <Currency amount={deposit} tokenAddress={tokenAddress} />
            </Deposit>
          </EventDetails>
        </Link>
      </EventCardContainer>
    )
  }
}

export default EventCard
