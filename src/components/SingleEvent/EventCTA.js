import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { PARTICIPANT_STATUS, calculateNumAttended } from '@wearekickback/shared'
import { TOKEN_QUERY, TOKEN_ALLOWANCE_QUERY } from '../../graphql/queries'
import DefaultRSVP from './RSVP'
import DefaultApprove from './Approve'
import WithdrawPayout from './WithdrawPayout'
import SafeQuery from '../SafeQuery'
import Contribute from './Contribute'
import CheckWhitelist from './CheckWhitelist'
import moment from 'moment'
import { toPrettyDate } from '../../utils/dates'
import { depositValue } from '../Utils/DepositValue'

import { toBN } from 'web3-utils'

import {
  calculateWinningShare,
  getParticipantsMarkedAttended
} from '../../utils/parties'
import Status, { Going } from './Status'
import DefaultButton from '../Forms/Button'
import WarningBox from '../WarningBox'

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

const CTAButtonContainer = styled('div')`
  margin-top: 1em;
`

const GreenBox = styled('div')`
  color: #5cca94;
  margin: 5px;
`

const Choose = ({ changeMode }) => {
  return (
    <div>
      <Button onClick={() => changeMode('contribute')}>Contribute some</Button>
      <a
        href="#/"
        onClick={e => {
          e.preventDefault()
          changeMode('withdraw')
        }}
      >
        {' '}
        Or Withdraw All
      </a>
    </div>
  )
}

const WithdrawOrBack = ({ changeMode, address, myShare, canGoBack }) => {
  return (
    <div>
      <WithdrawPayout address={address} amount={myShare} />
      <a
        href="#/"
        onClick={e => {
          e.preventDefault()
          changeMode('initial')
        }}
      >
        {' '}
        {canGoBack ? 'Or Go back' : ''}
      </a>
    </div>
  )
}

class EventCTA extends Component {
  constructor(props) {
    super(props)
    this.state = { mode: 'initial', percentage: 10 }
  }

  changeMode = mode => {
    this.setState({
      mode: mode
    })
  }

  changeValue = event => {
    this.setState({
      percentage: event.target.value
    })
  }

  _renderCleared() {
    return (
      <Status>This event is over and all the funds have been cleared</Status>
    )
  }
  _renderEndedRsvp({ symbol, decimals }) {
    const {
      myParticipantEntry,
      party: {
        address,
        deposit,
        participants,
        tokenAddress,
        coolingPeriod,
        end,
        finalizedAt,
        timezone,
        clearFee,
        optional,
        roles
      }
    } = this.props

    if (!myParticipantEntry) {
      return ''
    }

    const totalReg = participants.length
    const numWent = calculateNumAttended(participants)
    const delimiters = Math.pow(10, decimals)
    const myShare = calculateWinningShare(deposit, totalReg, numWent)
    const recipientAddresses = optional && optional.recepients
    let CTAButton
    let won = false
    let CTAMessage = ''
    const endOfCoolingPeriod = end
      ? moment(finalizedAt).add(parseInt(coolingPeriod), 's')
      : null
    const coolingPeriodEnded = endOfCoolingPeriod
      ? endOfCoolingPeriod.isBefore(moment())
      : false
    switch (myParticipantEntry.status) {
      case PARTICIPANT_STATUS.REGISTERED:
        CTAButton = <Status>You didn't show up :/</Status>
        break
      case PARTICIPANT_STATUS.SHOWED_UP:
        if (
          !recipientAddresses ||
          recipientAddresses.length === 0 ||
          this.state.mode === 'withdraw'
        ) {
          CTAButton = (
            <WithdrawOrBack
              changeMode={this.changeMode}
              address={address}
              myShare={myShare}
              canGoBack={recipientAddresses && recipientAddresses.length > 0}
            />
          )
        } else if (this.state.mode === 'contribute') {
          CTAButton = (
            <Contribute
              address={address}
              addresses={recipientAddresses}
              roles={roles}
              percentage={this.state.percentage}
              myShare={myShare}
              tokenAddress={tokenAddress}
              changeMode={this.changeMode}
              changeValue={this.changeValue}
              currencySymbol={symbol}
              delimiters={delimiters}
            />
          )
        } else {
          CTAButton = (
            <Choose
              myShare={myShare}
              delimiters={delimiters}
              currencySymbol={symbol}
              changeMode={this.changeMode}
            ></Choose>
          )
        }
        CTAMessage = 'Please withdraw your payout now.'
        won = true
        break
      case PARTICIPANT_STATUS.WITHDRAWN_PAYOUT:
        CTAButton = ''
        won = true
        CTAMessage = 'You have withdrawn your payout.'
        break
      default:
        CTAButton = ''
        break
    }
    return (
      <>
        {won ? (
          <CTAInfo>
            <h3>
              You have payout of {depositValue(myShare, delimiters.length, 3)}{' '}
              {symbol} !
            </h3>
            <p>
              You have a choice of either withdrawing all amount or contributing
              some of your payout to the organiser who made it all work.
            </p>
            <p>
              {coolingPeriodEnded
                ? `Now that cooling period is over, `
                : `If you do not withdraw by the end of cooling period (${toPrettyDate(
                    endOfCoolingPeriod.unix() * 1000,
                    timezone
                  )}), `}
              admins may automatically send back to you after substracting{' '}
              {clearFee / 10} % as clearing fee from your payout.
            </p>
            <p>{CTAMessage}</p>
          </CTAInfo>
        ) : (
          ''
        )}
        <CTAButtonContainer>{CTAButton}</CTAButtonContainer>
      </>
    )
  }

  _renderActiveRsvpWrapper() {
    const {
      myParticipantEntry,
      party: {
        tokenAddress,
        address,
        deposit,
        participants,
        participantLimit,
        optional
      },
      userAddress
    } = this.props
    const event_whitelist = optional && optional.event_whitelist
    if (!myParticipantEntry) {
      if (participants.length < participantLimit) {
        if (event_whitelist) {
          return (
            <CheckWhitelist
              userAddresses={[userAddress]}
              tokenAddress={event_whitelist.address}
            >
              {a => {
                let mainnetTokenBalance, hasMainnetToken
                if (a && a.getMainnetTokenBalance) {
                  mainnetTokenBalance =
                    a.getMainnetTokenBalance.balances[0] /
                    Math.pow(10, a.getMainnetTokenBalance.decimals)
                  hasMainnetToken =
                    mainnetTokenBalance >= parseInt(event_whitelist.amount)
                }
                if (
                  event_whitelist &&
                  event_whitelist.address &&
                  a &&
                  a.getMainnetTokenBalance &&
                  !hasMainnetToken
                ) {
                  return (
                    <div styles={{ width: '100%' }}>
                      <WarningBox>
                        This event is for{' '}
                        <a
                          href={`https://app.uniswap.org/#/swap?outputCurrency=${event_whitelist &&
                            event_whitelist.address}&use=V2`}
                        >
                          ${a.getMainnetTokenBalance.symbol}
                        </a>{' '}
                        token holder only. You need at least{' '}
                        {event_whitelist.amount} $
                        {a.getMainnetTokenBalance.symbol} on Ethereum Mainnet.
                      </WarningBox>
                    </div>
                  )
                } else {
                  return (
                    <>
                      {event_whitelist &&
                        a &&
                        a.getMainnetTokenBalance &&
                        hasMainnetToken && (
                          <GreenBox>
                            You have {mainnetTokenBalance.toFixed(2)} $
                            {a.getMainnetTokenBalance.symbol} tokens
                          </GreenBox>
                        )}

                      <SafeQuery
                        query={TOKEN_ALLOWANCE_QUERY}
                        variables={{
                          userAddress,
                          tokenAddress,
                          partyAddress: address
                        }}
                      >
                        {({
                          data: {
                            tokenAllowance: { allowance, balance }
                          },
                          loading,
                          refetch
                        }) => {
                          const decodedDeposit = parseInt(
                            toBN(deposit).toString()
                          )
                          const isAllowed =
                            parseInt(allowance) >= decodedDeposit
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
                            userAddress,
                            refetch
                          })
                        }}
                      </SafeQuery>
                    </>
                  )
                }
              }}
            </CheckWhitelist>
          )
        } else {
          return (
            <SafeQuery
              query={TOKEN_ALLOWANCE_QUERY}
              variables={{
                userAddress,
                tokenAddress,
                partyAddress: address
              }}
            >
              {({
                data: {
                  tokenAllowance: { allowance, balance }
                },
                loading,
                refetch
              }) => {
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
                  userAddress,
                  refetch
                })
              }}
            </SafeQuery>
          )
        }
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
    refetch,
    userAddress
  }) {
    return (
      <>
        <SafeQuery
          query={TOKEN_QUERY}
          variables={{ address: tokenAddress }}
          renderError={err => {
            return (
              <WarningBox>
                {' '}
                Can't find a token at address: {tokenAddress}
              </WarningBox>
            )
          }}
        >
          {({
            data: {
              token: { name, symbol, decimals }
            },
            loading
          }) => {
            return (
              <>
                <Approve
                  tokenAddress={tokenAddress}
                  address={address}
                  deposit={deposit}
                  decodedDeposit={decodedDeposit}
                  decimals={decimals}
                  balance={balance}
                  isAllowed={isAllowed}
                  hasBalance={hasBalance}
                  refetch={refetch}
                  userAddress={userAddress}
                />
                <RSVP
                  tokenAddress={tokenAddress}
                  address={address}
                  deposit={deposit}
                  decimals={decimals}
                  isAllowed={isAllowed}
                  hasBalance={hasBalance}
                />
              </>
            )
          }}
        </SafeQuery>
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
      party: { ended, cancelled, participants, balance, tokenAddress }
    } = this.props
    const cleared = ended && parseInt(balance) === 0
    return (
      <SafeQuery
        query={TOKEN_QUERY}
        variables={{ address: tokenAddress }}
        // renderError={err => {
        //   return (
        //     <WarningBox>
        //       {' '}
        //       Can't find a token at address: {tokenAddress}
        //     </WarningBox>
        //   )
        // }}
      >
        {({ data: { token }, loading }) => {
          return (
            <EventCTAContainer>
              <RSVPContainer>
                {!cleared
                  ? ended
                    ? this._renderEndedRsvp(token)
                    : this._renderActiveRsvpWrapper(token)
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
        }}
      </SafeQuery>
    )
  }
}

const EventCTAContainer = styled('div')``

export default EventCTA
