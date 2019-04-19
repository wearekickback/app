import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'
import { PARTICIPANT_STATUS, calculateNumAttended } from '@wearekickback/shared'
import { toEthVal } from '../../utils/units'
import DefaultRSVP from './RSVP'
import WithdrawPayout from './WithdrawPayout'
import {
  calculateWinningShare,
  getParticipantsMarkedAttended
} from '../../utils/parties'
import Status, { Going } from './Status'
import DefaultButton from '../Forms/Button'

const AdminPanelButtonWrapper = styled('div')``

const Button = styled(DefaultButton)`
  margin-bottom: 20px;
  a {
    color: white;
  }
`

const Label = styled('span')`
  background-color: ${props => (props.free ? 'green' : 'orange')};
  border-radius: 10px;
  color: white;
  margin-left: 5px;
  padding: 5px;
`

const CTA = styled('div')`
  font-family: Muli;
  font-weight: 500;
  font-size: 15px;
  color: #3d3f50;
  letter-spacing: 0;
  margin-bottom: 25px;
`

const CTAInfo = styled('div')`
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
  margin-top: 20px;

  ul {
    margin-left: 2.5em;
  }
`

const RSVPContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
`
const Reference = styled('p')`
  a {
    text-decoration: underline;
  }
`

const RSVP = styled(DefaultRSVP)`
  width: 100%;
`

const MarkAttended = styled('div')``

class EventCTA extends Component {
  _renderCleared() {
    return (
      <Status>This event is over and all the funds have been cleared</Status>
    )
  }
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
      party: {
        address,
        deposit,
        participants,
        participantLimit,
        eventType,
        kickback,
        kickback50percent,
        kickback80percent,
        price,
        yourReturn,
        kickbackReturn
      }
    } = this.props
    if (!myParticipantEntry) {
      if (participants.length < participantLimit) {
        return (
          <>
            <RSVP address={address} deposit={deposit} price={price} />
            <CTAInfo>
              <strong>Kickback rules:</strong>
              <Label free={eventType === 'free'}>
                {eventType === 'free' ? 'Free' : 'Paid'}
              </Label>
              <Label free={eventType !== 'full'}>
                {eventType !== 'full' ? 'Kickback' : 'No Kickback'}
              </Label>
              <p>This is a {eventType === 'free' ? 'free' : 'paid'} event</p>
              {eventType !== 'full' ? (
                <ul>
                  <li>
                    Any no-shows lose their ETH, which will be
                    <strong> split amongst the attendees</strong>.
                  </li>
                  <li>
                    After the event you can withdraw your post-event return of
                  </li>
                  <ul>
                    <li>
                      {kickback.toFixed(3)} ETH ($
                      {(kickback * price).toFixed(2)}) if 100% of people turn
                      up.
                    </li>
                    <li>
                      {kickback80percent.toFixed(5)} ETH ($
                      {(kickback80percent * price).toFixed(2)}) if 80% of people
                      turn up.
                    </li>
                    <li>
                      {kickback50percent.toFixed(5)} ETH ($
                      {(kickback50percent * price).toFixed(2)}) if 50% of people
                      turn up.
                    </li>
                  </ul>
                </ul>
              ) : (
                ''
              )}

              {eventType !== 'free' ? (
                <span>
                  If everybody({participantLimit}) commits{' '}
                  {toEthVal(deposit)
                    .toEth()
                    .toFixed(2)}{' '}
                  ETH, the event organiser takes {yourReturn.toFixed(3)} ETH ($
                  {(yourReturn * price).toFixed(2)})
                  <br />
                  Kickback takes 5 % ({kickbackReturn.toFixed(3)} ETH = $
                  {(kickbackReturn * price).toFixed(2)}) as a service fee.
                </span>
              ) : (
                ''
              )}

              <p>Please remember:</p>
              <ul>
                <li>Once you RSVP, you cannot cancel.</li>
                {eventType !== 'full' ? (
                  <li>
                    The event organiser must mark you as attended in order for
                    you to qualify for the payout.
                  </li>
                ) : (
                  ''
                )}
                <li>
                  You must withdraw your payout within the post-event cooling
                  period.
                </li>
              </ul>
              <Reference>
                For more detail please see{' '}
                <Link to="/gettingstarted">Getting started</Link> and{' '}
                <Link to="/terms">Terms and conditions</Link>.
              </Reference>
            </CTAInfo>
          </>
        )
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

  _renderAdminCTA() {
    const {
      party: { address },
      amAdmin
    } = this.props

    return (
      amAdmin && (
        <AdminPanelButtonWrapper>
          <Button>
            <Link to={`/event/${address}/admin`}>Admin Panel</Link>
          </Button>
        </AdminPanelButtonWrapper>
      )
    )
  }

  _renderCanceled() {
    return (
      <CTA>
        This event has been cancelled.
        {this._renderAdminCTA()}
      </CTA>
    )
  }

  _renderEnded() {
    const {
      party: { participants }
    } = this.props

    const totalReg = participants.length
    const numWent = calculateNumAttended(participants)

    return (
      <>
        {this._renderAdminCTA()}
        <CTA>
          This event is over. {numWent} out of {totalReg} people went to this
          event.
        </CTA>
      </>
    )
  }

  render() {
    let {
      party: { ended, cancelled, participants, balance }
    } = this.props

    const cleared =
      balance &&
      toEthVal(balance)
        .toEth()
        .toNumber() === 0 &&
      ended

    return (
      <EventCTAContainer>
        <RSVPContainer>
          {!cleared
            ? ended
              ? this._renderEndedRsvp()
              : this._renderActiveRsvp()
            : this._renderCleared()}
        </RSVPContainer>
        {ended
          ? cancelled
            ? this._renderCanceled()
            : this._renderEnded()
          : this._renderAdminCTA()}
        <MarkAttended>
          {`${getParticipantsMarkedAttended(participants)}/${
            participants.length
          } have been marked attended`}{' '}
        </MarkAttended>
      </EventCTAContainer>
    )
  }
}

const EventCTAContainer = styled('div')``

export default EventCTA
