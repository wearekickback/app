import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'
import { PARTICIPANT_STATUS, calculateNumAttended } from '@wearekickback/shared'
import { toEthVal } from '../../utils/units'
import { TOKEN_ALLOWANCE_QUERY } from '../../graphql/queries'
import DefaultRSVP from './RSVP'
import DefaultApprove from './Approve'
import WithdrawPayout from './WithdrawPayout'
import SafeQuery from '../SafeQuery'

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

const Approve = styled(DefaultApprove)`
  width: 100%;
  margin-bottom: 1em;
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
      party: { tokenAddress, address, deposit, participants, participantLimit }
    } = this.props
    if (!myParticipantEntry) {
      if (participants.length < participantLimit) {
        return (
          <SafeQuery
            query={TOKEN_ALLOWANCE_QUERY}
            variables={{ tokenAddress, partyAddress: address }}
          >
            {({
              data: {
                tokenAllowance: { allowance }
              },
              loading
            }) => {
              console.log('data', allowance)
              // const allowance = data
              const isAllowed = parseInt(allowance) > 0
              return (
                <>
                  <Approve
                    tokenAddress={tokenAddress}
                    address={address}
                    deposit={deposit}
                    isAllowed={isAllowed}
                  />
                  <RSVP
                    address={address}
                    deposit={deposit}
                    isAllowed={isAllowed}
                  />
                  <CTAInfo>
                    <strong>Kickback rules:</strong>
                    <ul>
                      <li>
                        Everyone commits a small amount of ETH when they RSVP.
                      </li>
                      <li>
                        Any no-shows lose their ETH, which will be
                        <strong> split amongst the attendees</strong>.
                      </li>
                      <li>
                        After the event you can withdraw your post-event payout.
                      </li>
                    </ul>
                    <p>Please remember:</p>
                    <ul>
                      <li>Once you RSVP, you cannot cancel.</li>
                      <li>
                        The event organiser must mark you as attended in order
                        for you to qualify for the payout.
                      </li>
                      <li>
                        You must withdraw your payout within the post-event
                        cooling period.
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
            }}
          </SafeQuery>
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
    console.log({ ended, cancelled, participants, balance })
    // const cleared =
    //   balance &&
    //   toEthVal(balance)
    //     .toEth()
    //     .toNumber() === 0 &&
    //   ended
    // ERC20 has no balance hence always 0
    // TODO: Refactor balance function
    const cleared = false
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
