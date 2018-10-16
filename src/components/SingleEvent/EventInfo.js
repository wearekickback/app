import React, { Component } from 'react'
import styled from 'react-emotion'

import EtherScanLink from '../ExternalLinks/EtherScanLink'
import { H2 } from '../Typography/Basic'
import DefaultAvatar from '../User/Avatar'
import { ReactComponent as DefaultEthIcon } from '../svg/Ethereum.svg'
import { ReactComponent as DefaultPinIcon } from '../svg/Pin.svg'
// import Tooltip from '../Tooltip/Tooltip'

import { toEthVal } from '../../utils/units'
import { getSocial } from '../../utils/parties'

const Date = styled('div')``
const EventName = styled(H2)``
const ContractAddress = styled('h3')`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: Muli;
  font-weight: 500;
  font-size: 13px;
  color: #6e76ff;
  letter-spacing: 0;
`
const EventImage = styled('img')`
  border-radius: 4px;
  margin-bottom: 20px;
`

const Avatar = styled(DefaultAvatar)`
  margin-right: 10px;
  height: 35px;
  width: 35px;
  flex-shrink: 0;
`

const Organiser = styled('div')`
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 20px;

  span {
    margin-right: 5px;
  }
`

const PinIcon = styled(DefaultPinIcon)`
  margin-right: 10px;
`

const Location = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-family: Muli;
  font-weight: 500;
  font-size: 14px;
  color: #3d3f50;
  line-height: 21px;
`
const EthIcon = styled(DefaultEthIcon)`
  margin-right: 10px;
`
const TotalPot = styled('div')`
  font-family: Muli;
  font-weight: 600;
  font-size: 14px;
  color: #3d3f50;
  text-align: left;
  line-height: 21px;
  display: flex;
  align-items: center;
  span {
    font-weight: 400;
    margin-left: 0.5rem;
  }
`
const EventDescription = styled('p')`
  white-space: pre-line;
`
const EventWarning = styled('div')`
  font-family: Muli;
  font-weight: 500;
  padding: 20px;
  font-size: 13px;
  color: #6e76ff;
  letter-spacing: 0;
  text-align: left;
  line-height: 21px;
  background: rgba(233, 234, 255, 0.5);
  border-radius: 4px;

  ul {
    margin-left: 2.5em;
  }
`
const Photos = styled('section')``
const PhotoContainer = styled('div')``
const Photo = styled('img')``
const Comments = styled('section')``
const Comment = styled('div')``

const HostUsername = styled('span')`
  font-weight: bold;
`

class EventInfo extends Component {
  render() {
    const { party, address, className } = this.props
    return (
      <EventInfoContainer className={className}>
        <Date>{party.date || 'Tuesday, 23rd Sep, 2018 9:00 PM'}</Date>
        <EventName>{party.name}</EventName>
        <ContractAddress>
          <EtherScanLink address={address}>{address}</EtherScanLink>
        </ContractAddress>
        <EventImage src={party.image || 'https://placeimg.com/640/480/tech'} />
        <Organiser>
          <Avatar
            src={`https://avatars.io/twitter/${getSocial(
              party.owner.social,
              'twitter'
            ) || 'randomtwitter'}`}
          />{' '}
          <span>Hosted by</span>
          <HostUsername>{party.owner.username}</HostUsername>
        </Organiser>
        <Location>
          <PinIcon />
          {party.location || '11 Macclesfield St, London W1D 5BW'}
        </Location>
        <TotalPot>
          <EthIcon />
          Total pot{' '}
          <span>
            {toEthVal(party.deposit)
              .mul(party.participants.length)
              .toEth()
              .toFixed(2)}{' '}
            ETH
          </span>
          {/* <Tooltip text="participants * deposit" /> */}
        </TotalPot>
        <EventDescription>{party.description}</EventDescription>
        <EventWarning>
          <strong>You cannot cancel once registered.</strong>
          <p>Also, your payment is <strong>non-refundable</strong> if:</p>
          <ul>
            <li>You RSVP but then don't turn up and get marked as attended.</li>
            <li>You fail to withdraw your post-event payout within the cooling period.</li>
          </ul>
        </EventWarning>
        <Photos>
          <PhotoContainer>
            <Photo />
          </PhotoContainer>
        </Photos>
        <Comments>
          <Comment />
        </Comments>
      </EventInfoContainer>
    )
  }
}

const EventInfoContainer = styled('div')``

export default EventInfo
