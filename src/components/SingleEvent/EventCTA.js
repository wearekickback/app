import React, { Component } from 'react'
import styled from 'react-emotion'

import DefaultRSVP from './RSVP'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import WithdrawPayout from './WithdrawPayout'
import { pluralize } from '../../utils/strings'
import { PARTICIPANT_STATUS } from '../../utils/status'
import DepositValue from '../Utils/DepositValue'
import {
  calculateFinalizeMaps,
  calculateNumAttended,
  calculateWinningShare
} from '../../utils/parties'
import { PartyQuery } from '../../graphql/queries'
import { Finalize } from '../../graphql/mutations'
import Status, { Going } from './Status'

const CTA = styled('div')`
  font-family: Muli;
  font-weight: 500;
  font-size: 13px;
  color: #3d3f50;
  letter-spacing: 0;
  margin-bottom: 35px;
`

const RemainingSpots = styled('span')``
const RSVPContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`
const Deposit = styled('div')`
  font-family: Muli;
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

const RSVP = styled(DefaultRSVP)`
  width: calc(100% - 120px);
`

const AdminCTA = styled('div')`
  margin-bottom: 20px;
`

class EventCTA extends Component {
  _renderEndedRsvp() {
    const {
      myParticipantEntry,
      party: { address, deposit, participants }
    } = this.props

    if (!myParticipantEntry) {
      return ''
    }

    const totalReg = participants.length
    const numWent = calculateNumAttended(participants)

    const myShare = calculateWinningShare(deposit, totalReg, numWent)

    switch (myParticipantEntry.status) {
      case PARTICIPANT_STATUS.REGISTERED:
        return <Status>You didn't show up :/</Status>
      case PARTICIPANT_STATUS.SHOWED_UP:
        return <WithdrawPayout address={address} amount={myShare} />
      case PARTICIPANT_STATUS.WITHDRAWN_PAYOUT:
        return <Status>You have withdrawn your payout!</Status>
      default:
        return ''
    }
  }

  _renderActiveRsvp() {
    const {
      myParticipantEntry,
      party: { address, participants, participantLimit }
    } = this.props

    if (!myParticipantEntry) {
      if (participants.length < participantLimit) {
        return <RSVP address={address} />
      }

      return ''
    }

    switch (myParticipantEntry.status) {
      case PARTICIPANT_STATUS.REGISTERED:
        return <Going>You're going</Going>
      case PARTICIPANT_STATUS.SHOWED_UP:
        return <Status>You have showed up!</Status>
      default:
        return ''
    }
  }

  _renderJoin() {
    const {
      party: { participants, participantLimit }
    } = this.props

    return (
      <CTA>
        Join the event!{' '}
        <RemainingSpots>
          {`${participants.length} going. ${participantLimit -
            participants.length} ${pluralize(
            'spot',
            participantLimit - participants.length
          )} left.`}
        </RemainingSpots>
      </CTA>
    )
  }

  _renderEventFull() {
    return <CTA>This event is now full.</CTA>
  }

  _renderCanceled() {
    return <CTA>This event has been cancelled.</CTA>
  }

  _renderEnded() {
    const {
      party: { participants }
    } = this.props

    const totalReg = participants.length
    const numWent = calculateNumAttended(participants)

    return (
      <CTA>
        This meetup is past. {numWent} out of {totalReg} people went to this
        event.
      </CTA>
    )
  }

  render() {
    const {
      party: {
        address,
        participants,
        participantLimit,
        deposit,
        ended,
        cancelled
      },
      amAdmin
    } = this.props

    const totalReg = participants.length

    return (
      <EventCTAContainer>
        <RSVPContainer>
          <Deposit>
            <DepositValue value={deposit} /> ETH
          </Deposit>
          {ended ? this._renderEndedRsvp() : this._renderActiveRsvp()}
        </RSVPContainer>
        {ended
          ? cancelled
            ? this._renderCanceled()
            : this._renderEnded()
          : totalReg < participantLimit
            ? this._renderJoin()
            : this._renderEventFull()}
        {amAdmin && (
          <AdminCTA>
            {!ended ? (
              <ChainMutation
                mutation={Finalize}
                resultKey="finalize"
                variables={{
                  address,
                  maps: calculateFinalizeMaps(participants)
                }}
                refetchQueries={[{ query: PartyQuery, variables: { address } }]}
              >
                {(finalize, result) => (
                  <ChainMutationButton
                    result={result}
                    onClick={finalize}
                    toThirds
                    preContent="Finalize and enable payouts"
                    postContent="Finalize and enable payouts"
                  />
                )}
              </ChainMutation>
            ) : null}
          </AdminCTA>
        )}
      </EventCTAContainer>
    )
  }
}

const EventCTAContainer = styled('div')``

export default EventCTA
