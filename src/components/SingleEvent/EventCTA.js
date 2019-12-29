import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'
import { PARTICIPANT_STATUS, calculateNumAttended } from '@wearekickback/shared'
import { isEmptyAddress } from '../../api/utils'
import { TOKEN_ALLOWANCE_QUERY } from '../../graphql/queries'
import DefaultRSVP from './RSVP'
import DefaultApprove from './Approve'
import WithdrawPayout from './WithdrawPayout'
import TipOrganiser from './TipOrganiser'
import SafeQuery from '../SafeQuery'
import { toBN } from 'web3-utils'
import { toEthVal } from '../../utils/units'
import { A } from '../Typography/Basic'
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

const Note = styled('p')`
  color: #5cca94;
  background-color: #e7f7ef;
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

const Donate = 'donate'
const WithdrawAll = 'withdraw_all'

class EventCTA extends Component {
  constructor(props) {
    super(props)
    this.state = { mode: WithdrawAll, tip: 0, donation: null }
  }

  changeMode = mode => {
    this.setState({
      mode: mode
    })
  }

  changeTipAmount = event => {
    this.setState({
      tip: parseFloat(event.target.value)
    })
  }

  _renderCleared() {
    return (
      <Status>This event is over and all the funds have been cleared</Status>
    )
  }
  _renderEndedRsvp() {
    const {
      myParticipantEntry,
      party: { address, deposit, participants, donations }
    } = this.props

    if (!myParticipantEntry) {
      return ''
    }

    if (this.state.donation == null && donations.length > 0) {
      this.setState({
        donation: donations[0],
        mode: 'initial',
        tip: parseFloat(donations[0].amount)
      })
    }

    const totalReg = participants.length
    const numWent = calculateNumAttended(participants)

    const myShare = calculateWinningShare(deposit, totalReg, numWent)

    const currencySymbol =
      this.props.party.tokenAddress ===
      '0x0000000000000000000000000000000000000000'
        ? 'ETH'
        : 'DAI'

    if (this.state.mode === WithdrawAll) {
      return <WithdrawPayout address={address} amount={myShare} />
    }
    if (this.state.mode === Donate) {
      const donation = this.state.donation
      const Extra =
        myShare -
        toEthVal(deposit)
          .toEth()
          .toFixed(3)
      return (
        <TipOrganiser
          address={address}
          destinationAddresses={[donation.beneficiaryAddress]}
          all={parseFloat(myShare)}
          extra={parseFloat(Extra)}
          custom={parseFloat(donation.amount)}
          tip={this.state.tip}
          withdraw={myShare - this.state.tip}
          Button={Button}
          changeMode={this.changeMode}
          changeTipAmount={this.changeTipAmount}
          currencySymbol={currencySymbol}
        />
      )
    }

    switch (myParticipantEntry.status) {
      case PARTICIPANT_STATUS.REGISTERED:
        return <Status>You didn't show up :/</Status>
      case PARTICIPANT_STATUS.SHOWED_UP:
        return (
          <>
            <p>
              You're owed {myShare} {currencySymbol}
            </p>
            <Button onClick={() => this.changeMode(Donate)}>
              Contribute to {this.state.donation.name}
            </Button>
            <Note>{this.state.donation.note}</Note>
            <A onClick={() => this.changeMode(WithdrawAll)}> Or Withdraw All</A>
          </>
        )
      case PARTICIPANT_STATUS.WITHDRAWN_PAYOUT:
        return <Status>You have withdrawn your payout!</Status>
      default:
        return ''
    }
  }

  _renderActiveRsvpWrapper() {
    const {
      myParticipantEntry,
      party: { tokenAddress, address, deposit, participants, participantLimit }
    } = this.props
    if (!myParticipantEntry) {
      if (participants.length < participantLimit) {
        if (isEmptyAddress(tokenAddress)) {
          return this._renderActiveRsvp({
            myParticipantEntry,
            tokenAddress,
            address,
            deposit,
            participants,
            participantLimit,
            isAllowed: true
          })
        }
        return (
          <SafeQuery
            query={TOKEN_ALLOWANCE_QUERY}
            variables={{ tokenAddress, partyAddress: address }}
          >
            {({
              data: {
                tokenAllowance: { allowance, balance }
              },
              loading,
              refetch
            }) => {
              console.log({ allowance, balance })
              const decodedDeposit = parseInt(toBN(deposit).toString())
              const isAllowed = parseInt(allowance) >= decodedDeposit
              const hasBalance = parseInt(balance) >= decodedDeposit
              return this._renderActiveRsvp({
                myParticipantEntry,
                tokenAddress,
                address,
                deposit,
                decodedDeposit,
                participants,
                participantLimit,
                balance,
                isAllowed,
                hasBalance,
                refetch
              })
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

  _renderActiveRsvp({
    tokenAddress,
    address,
    deposit,
    decodedDeposit,
    isAllowed,
    hasBalance,
    balance,
    refetch
  }) {
    const isToken = !isEmptyAddress(tokenAddress) || tokenAddress !== null
    return (
      <>
        {isToken ? (
          <Approve
            tokenAddress={tokenAddress}
            address={address}
            deposit={deposit}
            decodedDeposit={decodedDeposit}
            balance={balance}
            isAllowed={isAllowed}
            hasBalance={hasBalance}
            refetch={refetch}
          />
        ) : null}
        <RSVP
          tokenAddress={tokenAddress}
          address={address}
          deposit={deposit}
          isAllowed={isAllowed}
          hasBalance={hasBalance}
        />
        <CTAInfo>
          <strong>Kickback rules:</strong>
          <ul>
            <li>
              Everyone commits a small amount of ETH/Token when they RSVP.
            </li>
            <li>
              Any no-shows or late shows who did not turn up by the{' '}
              <strong>arrive by cut off time</strong> will lose their commitment
              and will be
              <strong> split amongst the attendees</strong>.
            </li>
            <li>After the event you can withdraw your post-event payout.</li>
          </ul>
          <p>Please remember:</p>
          <ul>
            <li>Once you RSVP, you cannot cancel.</li>
            <li>
              The event organiser must mark you as attended in order for you to
              qualify for the payout.
            </li>
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
      // party: { ended, cancelled, participants, balance }
      party: { ended, cancelled, participants }
    } = this.props
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
              : this._renderActiveRsvpWrapper()
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
