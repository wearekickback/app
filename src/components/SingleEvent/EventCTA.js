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
  _renderEnded() {
    const {
      userAddress,
      party: { participants }
    } = this.props

    const went = amParticipant(participants, userAddress)

    const cta = (
      <CTA>
        This meetup is past. {participants.length} people registered to attend
        this event.
      </CTA>
    )

    if (!went) {
      return cta
    }

    switch (went.status) {
      case PARTICIPANT_STATUS.REGISTERED:
        return <Going>You didn't show up :/</Going>
      case PARTICIPANT_STATUS.SHOWED_UP:
        return <Going>You attended!</Going>
      default:
        return cta
    }
  }

  _renderActive() {
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

  render() {
    const {
      party: { admins, participants, participantLimit, deposit, ended },
      userAddress
    } = this.props

    let isAdmin = userAddress && admins && amInAddressList(admins, userAddress)

    return (
      <EventCTAContainer>
        <RSVPContainer>
          <Deposit>
            {parseEthValue(deposit)
              .toEth()
              .toFixed(2)}{' '}
            ETH
          </Deposit>
          {ended ? this._renderEnded() : this._renderActive()}
        </RSVPContainer>
        {ended ? (
          <CTA>
            This meetup is past. {participants.length} people went to this
            event.
          </CTA>
        ) : (
          <CTA>Join the event.</CTA>
        )}
        {!ended && (
          <RemainingSpots>
            {`${participants.length} going. ${pluralize(
              'spot',
              participantLimit - participants.length
            )} left.`}
          </RemainingSpots>
        )}
        {isAdmin && <AdminCTA>I'm admin!</AdminCTA>}
      </EventCTAContainer>
    )
  }
}

const EventCTAContainer = styled('div')``

export default EventCTA
