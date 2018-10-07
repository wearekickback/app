import React, { Component } from 'react'
import styled from 'react-emotion'

import DefaultRSVP from './RSVP'
import { amParticipant, amInAddressList } from '../../utils/parties'
import { pluralize } from '../../utils/strings'
import { PARTICIPANT_STATUS } from '../../utils/status'
import { parseEthValue } from '../../utils/calculations'

const CTA = styled('div')`
  font-family: Overpass;
  font-weight: 500;
  font-size: 13px;
  color: #3d3f50;
  letter-spacing: 0;
  margin-bottom: 35px;
`
const RemainingSpots = styled('div')``
const RSVPContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`
const Deposit = styled('div')`
  font-family: Overpass;
  font-weight: 500;
  font-size: 13px;
  color: #6e76ff;
  letter-spacing: 0;
  text-align: center;
  line-height: 21px;
  padding: 10px 20px;
  width: 100px;
  background: rgba(233, 234, 255, 0.5);
  border-radius: 4px;
`

const Going = styled('div')`
  background-color: #6e76ff;
  border-radius: 4px;
  border: 1px solid #6e76ff;
  font-size: 14px;
  font-family: Muli;
  padding: 10px 20px;
  color: white;
  width: calc(100% - 120px);
  text-align: center;
`

const RSVP = styled(DefaultRSVP)`
  width: calc(100% - 120px);
`

const AdminCTA = styled('div')``

class EventCTA extends Component {
  _renderEndedRsvp() {
    const {
      userAddress,
      party: { participants }
    } = this.props

    const went = amParticipant(participants, userAddress)

    if (!went) {
      return ''
    }

    switch (went.status) {
      case PARTICIPANT_STATUS.REGISTERED:
        return <Going>You didn't show up :/</Going>
      case PARTICIPANT_STATUS.SHOWED_UP:
        return <Going>You attended!</Going>
      default:
        return ''
    }
  }

  _renderActiveRsvp() {
    const {
      userAddress,
      party: { address, participants, participantLimit }
    } = this.props

    const going = amParticipant(participants, userAddress)

    if (!going) {
      if (participants.length < participantLimit) {
        return <RSVP address={address} />
      }

      return ''
    }

    switch (going.status) {
      case PARTICIPANT_STATUS.REGISTERED:
        return <Going>You are going to this event.</Going>
      case PARTICIPANT_STATUS.SHOWED_UP:
        return <Going>You have shown up, congrats!</Going>
      default:
        return ''
    }
  }

  _renderJoin () {
    const {
      party: { participants, participantLimit },
    } = this.props

    return (
      <>
        <CTA>Join the event.</CTA>
        <RemainingSpots>
          {`${participants.length} going. ${pluralize(
            'spot',
            participantLimit - participants.length
          )} left.`}
        </RemainingSpots>
      </>
    )
  }

  _renderEventFull () {
    return (
      <CTA>This event is now full.</CTA>
    )
  }

  _renderCanceled () {
    return (
      <CTA>This event has been cancelled.</CTA>
    )
  }

  _renderEnded () {
    const {
      party: { participants },
    } = this.props

    const totalReg = participants.length
    const numWent = participants.reduce((m, { status }) => (
      m + (PARTICIPANT_STATUS.SHOWED_UP === status ? 1 : 0)
    ), 0)

    return (
      <CTA>
        This meetup is past. {numWent} out of {totalReg} people went to
        this event.
      </CTA>
    )
  }

  render() {
    const {
      party: { admins, participants, participantLimit, deposit, ended, cancelled },
      userAddress
    } = this.props

    let isAdmin = userAddress && admins && amInAddressList(admins, userAddress)

    const totalReg = participants.length

    return (
      <EventCTAContainer>
        <RSVPContainer>
          <Deposit>
            {parseEthValue(deposit)
              .toEth()
              .toFixed(2)}{' '}
            ETH
          </Deposit>
          {ended ? this._renderEndedRsvp() : this._renderActiveRsvp()}
        </RSVPContainer>
        {ended ? (
          cancelled ? this._renderCanceled() : this._renderEnded()
        ) : (
          totalReg < participantLimit ? this._renderJoin() : this._renderEventFull()
        )}
        {isAdmin && <AdminCTA>I'm admin!</AdminCTA>}
      </EventCTAContainer>
    )
  }
}

const EventCTAContainer = styled('div')``

export default EventCTA
