import React, { Component } from 'react'
import styled from '@emotion/styled'
import { HashLink as DefaultHashLink } from 'react-router-hash-link'

import { extractUsersWithGivenEventRole, ROLE } from '@wearekickback/shared'
import ReactMarkdown from 'react-markdown'

import EtherScanLink from '../Links/EtherScanLink'
import { H2, H3 } from '../Typography/Basic'
import TwitterAvatar from '../User/TwitterAvatar'
import { ReactComponent as DefaultEthIcon } from '../svg/Ethereum.svg'
import { ReactComponent as DefaultClockIcon } from '../svg/clock.svg'
import DefaultEventDate from '../Utils/EventDate'
import { ReactComponent as DefaultPinIcon } from '../svg/Pin.svg'
import { ReactComponent as DefaultInfoIcon } from '../svg/info.svg'
import { ReactComponent as DefaultContractIcon } from '../svg/contract.svg'
import Currency from './Currency'

import moment from 'moment'
import { toEthVal } from '../../utils/units'
import { getHours, getUtcDateFromTimezone } from '../../utils/dates'

import AddToCalendar from './AddToCalendar'

const EventDate = styled(DefaultEventDate)``

const EventName = styled(H2)``
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
  margin-top: 2px;
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

const ContractDetail = styled('div')`
  display: flex;
  align-items: center;
  margin-top: 20px;
  font-family: Muli;
  font-weight: 500;
  font-size: 14px;
  color: #3d3f50;
  line-height: 21px;
`

const ContractIcon = styled('div')`
  margin-right: 10px;
  background: #e9eaff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  width: 35px;
  height: 35px;
  display: flex;
`

const ContractSVG = styled(DefaultContractIcon)`
  margin-right: 10px;
  margin-left: 10px;
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

  strong {
    font-weight: 600;
    margin-right: 10px;
  }

  span {
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

const Clock = styled('div')`
  background: #e9eaff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  width: 35px;
  height: 35px;
  display: flex;
`

const ClockSVG = styled(DefaultClockIcon)`
  width: 15px;
`

const TimeDetails = styled('div')`
  margin-top: 25px;
`

const InfoGrid = styled('div')`
  display: grid;
  grid-template-columns: 50px minmax(100px, 170px) minmax(100px, 250px);
`

const InfoGridItem = styled('div')``

const TimeLabel = styled('span')`
  font-weight: 600;
  margin-right: 10px;
  font-family: Muli;
  font-weight: 600;
  font-size: 14px;
  color: #3d3f50;
  text-align: left;
  line-height: 21px;
`

const Time = styled('span')`
  font-family: Muli;
  font-weight: 400;
  font-size: 14px;
  color: #3d3f50;
  text-align: left;

  line-height: 21px;
`

const HostUsername = styled('span')`
  font-weight: bold;
`

class EventInfo extends Component {
  render() {
    const { party, address, className } = this.props

    const admins = extractUsersWithGivenEventRole(party, ROLE.EVENT_ADMIN)

    const calendarEvent = {
      title: party.name,
      description: party.description,
      location: party.location,
      startTime: getUtcDateFromTimezone(party.start, party.timezone),
      endTime: getUtcDateFromTimezone(party.end, party.timezone)
    }

    return (
      <EventInfoContainer className={className}>
        <EventDate event={party} />
        <EventName>{party.name}</EventName>
        <EventImage src={party.headerImg} />
        <Organisers>
          <H3>Organisers</H3>
          <OrganiserList>
            {admins.map(user => {
              return (
                <Organiser key={user.username}>
                  <UserAvatar user={user} size={8} scale={5} />
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
          <InfoGrid>
            <EthIcon />
            <InfoGridItem>
              <TotalPot>
                <strong>Pot: </strong>
                <span>
                  <Currency
                    amount={party.deposit * party.participants.length}
                    tokenAddress={party.tokenAddress}
                  />
                </span>
              </TotalPot>
              <Deposit>
                <strong>RSVP: </strong>
                <Currency
                  amount={party.deposit}
                  tokenAddress={party.tokenAddress}
                />
              </Deposit>
            </InfoGridItem>
            <InfoGridItem>
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
            </InfoGridItem>
          </InfoGrid>
        </TotalPot>
        <TimeDetails>
          <InfoGrid>
            <Clock>
              <ClockSVG />
            </Clock>
            <InfoGridItem>
              <TimeLabel>Start:</TimeLabel>
              <Time>{getHours(party.start)}</Time>
              <AddToCalendar event={calendarEvent} />
            </InfoGridItem>
            {party.arriveBy && (
              <InfoGridItem>
                <TimeLabel>Arrive by: </TimeLabel>
                <Time>{getHours(party.arriveBy)}</Time>
              </InfoGridItem>
            )}
          </InfoGrid>
        </TimeDetails>
        <ContractDetail>
          <ContractIcon>
            <ContractSVG></ContractSVG>
          </ContractIcon>
          <EtherScanLink address={address}>{address}</EtherScanLink>
        </ContractDetail>
        <EventDescription>
          <ReactMarkdown source={party.description} />
        </EventDescription>
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
