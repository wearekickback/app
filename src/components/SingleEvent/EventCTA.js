import React, { Component } from 'react'
import styled from 'react-emotion'
import {
  PARTICIPANT_STATUS,
  calculateFinalizeMaps,
  calculateNumAttended
} from '@wearekickback/shared'
import { toEthVal } from '../../utils/units'

import DefaultRSVP from './RSVP'
import ChainMutation, { ChainMutationButton } from '../ChainMutation'
import WithdrawPayout from './WithdrawPayout'
import {
  calculateWinningShare,
  getParticipantsMarkedAttended
} from '../../utils/parties'
import { PartyQuery } from '../../graphql/queries'
import { Finalize } from '../../graphql/mutations'
import Status, { Going } from './Status'
import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'
import { CONFIRM_TRANSACTION } from '../../modals'
import ConfirmModal from '../ConfirmModal'

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

// const Deposit = styled('div')`
//   font-family: Muli;
//   font-weight: 500;
//   font-size: 13px;
//   color: #6e76ff;
//   letter-spacing: 0;
//   text-align: center;
//   line-height: 21px;
//   padding: 10px 20px;
//   width: 100px;
//   background: rgba(233, 234, 255, 0.5);
//   border: 1px solid rgba(233, 234, 255, 0.5);
//   border-radius: 4px;
// `

const RSVP = styled(DefaultRSVP)`
  width: 100%;
`

const AdminCTA = styled('div')`
  margin-top: 10px;
  display: flex;
  align-items: center;
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
      party: { address, deposit, participants, participantLimit }
    } = this.props

    if (!myParticipantEntry) {
      if (participants.length < participantLimit) {
        return (
          <>
            <RSVP address={address} deposit={deposit} />
            <CTAInfo>
              <strong>You cannot cancel once registered.</strong>
              <p>
                Also, your payment is <strong>non-refundable</strong> if:
              </p>
              <ul>
                <li>
                  You RSVP but then don't turn up in time (or don't get marked as
                  attended by the organizer).
                </li>
                <li>
                  You fail to withdraw your post-event payout within the cooling
                  period.
                </li>
              </ul>
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
      party: { address, participants, ended },
      amAdmin
    } = this.props

    return (
      amAdmin && (
        <GlobalConsumer>
          {({ toggleModal }) => {
            return (
              <AdminCTA>
                {!ended ? (
                  <>
                    <Button
                      onClick={() => {
                        toggleModal({
                          name: CONFIRM_TRANSACTION,
                          render: () => (
                            <ConfirmModal
                              message="Finalizing enables payouts for all that have been marked attended. This can only be done once is irreversible, are you sure you want to finalize?"
                              mutationComponent={
                                <ChainMutation
                                  mutation={Finalize}
                                  resultKey="finalize"
                                  variables={{
                                    address,
                                    maps: calculateFinalizeMaps(participants)
                                  }}
                                  refetchQueries={[
                                    {
                                      query: PartyQuery,
                                      variables: { address }
                                    }
                                  ]}
                                >
                                  {(finalize, result) => (
                                    <ChainMutationButton
                                      analyticsId="Finalize Event"
                                      result={result}
                                      onClick={finalize}
                                      preContent="Finalize and enable payouts"
                                      postContent="Finalized!"
                                    />
                                  )}
                                </ChainMutation>
                              }
                            >
                              rendering
                            </ConfirmModal>
                          )
                        })
                      }}
                    >
                      Finalize
                    </Button>
                  </>
                ) : null}
              </AdminCTA>
            )
          }}
        </GlobalConsumer>
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
      <CTA>
        This event is over. {numWent} out of {totalReg} people went to this
        event.
        {this._renderAdminCTA()}
      </CTA>
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
