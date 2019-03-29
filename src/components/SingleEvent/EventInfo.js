import React, { Component } from 'react'
import styled from 'react-emotion'
import { HashLink as DefaultHashLink } from 'react-router-hash-link'

import { extractUsersWithGivenEventRole, ROLE } from '@wearekickback/shared'
import marked from 'marked'

import EtherScanLink from '../ExternalLinks/EtherScanLink'
import { H2, H3 } from '../Typography/Basic'
import TwitterAvatar from '../User/TwitterAvatar'
import DepositValue from '../Utils/DepositValue'
import { ReactComponent as DefaultEthIcon } from '../svg/Ethereum.svg'
import DefaultEventDate from '../Utils/EventDate'
import { ReactComponent as DefaultPinIcon } from '../svg/Pin.svg'
import { ReactComponent as DefaultInfoIcon } from '../svg/info.svg'

import moment from 'moment'
import { toEthVal } from '../../utils/units'

const EventDate = styled(DefaultEventDate)``

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

const Organisers = styled('div')`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 40px;
`

const OrganiserList = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
`
const Organiser = styled('div')`
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;
`

const Link = styled(DefaultHashLink)`
  display: flex;
  margin-top: 2px;
`

const Pot = styled('div')`
  display: flex;
  flex-direction: column;
`

const Deposit = styled('div')`
  display: flex;
`

const InfoIcon = styled(DefaultInfoIcon)`
  margin-right: 5px;
  margin-left: 5px;
`

const PinIcon = styled(DefaultPinIcon)`
  margin-right: 10px;
  flex-shrink: 0;
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
  margin-top: 5px;
  margin-right: 10px;
`
const TotalPot = styled('div')`
  font-family: Muli;
  font-weight: 400;
  font-size: 14px;
  color: #3d3f50;
  text-align: left;
  line-height: 21px;
  display: flex;
  align-items: flex-start;

  strong {
    font-weight: 600;
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  span {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
`

const EventDescription = styled('div')`
  line-height: 1.6em;
  padding-top: 2em;
  p {
    margin: 0 0 1em 0;
  }
`

const UserAvatar = styled(TwitterAvatar)`
  margin-right: 10px;
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

    const admins = extractUsersWithGivenEventRole(party, ROLE.EVENT_ADMIN)

    return (
      <EventInfoContainer className={className}>
        <EventDate event={party} />
        <EventName>{party.name}</EventName>
        <ContractAddress>
          <EtherScanLink address={address}>{address}</EtherScanLink>
        </ContractAddress>
        <EventImage
          src={party.headerImg || 'https://placeimg.com/640/480/tech'}
        />
        <Organisers>
          <H3>Organisers</H3>
          <OrganiserList>
            {admins.map(user => {
              return (
                <Organiser key={user.username}>
                  <UserAvatar user={user} />
                  <HostUsername>{user.username}</HostUsername>
                </Organiser>
              )
            })}
          </OrganiserList>
        </Organisers>
        <H3>Event Details</H3>
        <Location>
          <PinIcon />
          {party.location || '11 Macclesfield St, London W1D 5BW'}
        </Location>
        <TotalPot>
          <EthIcon />

          <Pot>
            <TotalPot>
              <strong>Pot: </strong>
              <span>
                {toEthVal(party.deposit)
                  .mul(party.participants.length)
                  .toEth()
                  .toFixed(2)}{' '}
                ETH
              </span>
            </TotalPot>
            <Deposit>
              <strong>RSVP: </strong>
              <span>
                <DepositValue value={party.deposit} />
              </span>
            </Deposit>
          </Pot>

          <strong>
            Cooling Period{' '}
            <Link to="/faq#cooling">
              <InfoIcon />
            </Link>
            :{' '}
          </strong>
          <span>
            {moment
              .duration(toEthVal(party.coolingPeriod).toNumber(), 'seconds')
              .asDays()}{' '}
            days
          </span>
        </TotalPot>
        <EventDescription
          dangerouslySetInnerHTML={{ __html: marked(party.description || '') }}
        />
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
