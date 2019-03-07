import React from 'react'
import styled from 'react-emotion'
import { PARTICIPANT_STATUS, calculateNumAttended } from '@wearekickback/shared'

import DefaultTwitterAvatar from '../User/TwitterAvatar'
import Status from './ParticipantStatus'

import { toEthVal } from '../../utils/units'
import { calculateWinningShare } from '../../utils/parties'
import { GlobalConsumer } from '../../GlobalState'
import tick from '../svg/tick.svg'

// import EtherScanLink from '../ExternalLinks/EtherScanLink'

// const ParticipantName = styled('div')`
//   font-size: 12px;
//   font-weight: 700;
//   color: #3d3f50;
//   text-align: center;
// `

const TickContainer = styled('div')`
  width: 12px;
  margin-left: 3px;
`

const Tick = () => (
  <TickContainer>
    <img alt="tick" src={tick} />
  </TickContainer>
)

const ParticipantWrapper = styled('div')`
  height: ${p => (p.amAdmin ? '170px' : '120px')};
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ParticipantId = styled('div')`
  margin-bottom: 10px;
`

const ParticipantUsername = styled('div')`
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  color: #3d3f50;
  text-align: center;
`

const TwitterAvatar = styled(DefaultTwitterAvatar)`
  width: 60px;
  height: 60px;
  margin-bottom: 5px;
`

function Participant({ participant, party, amAdmin }) {
  const { user, status } = participant
  const { deposit, ended } = party

  const withdrawn = status === PARTICIPANT_STATUS.WITHDRAWN_PAYOUT
  const attended = status === PARTICIPANT_STATUS.SHOWED_UP || withdrawn

  const numRegistered = party.participants.length
  const numShowedUp = calculateNumAttended(party.participants)

  const payout = calculateWinningShare(deposit, numRegistered, numShowedUp)

  return (
    <GlobalConsumer>
      {({ userAddress, loggedIn }) => (
        <ParticipantWrapper amAdmin={amAdmin}>
          <TwitterAvatar user={user} />
          <ParticipantId>
            <ParticipantUsername>{user.username}</ParticipantUsername>
          </ParticipantId>
          {ended ? (
            attended ? (
              <Status type="won">{`${
                withdrawn ? ' Withdrew' : 'Won'
              } ${payout} ETH `}</Status>
            ) : (
              <Status type="lost">
                Lost{' '}
                {toEthVal(deposit)
                  .toEth()
                  .toString()}{' '}
                ETH
              </Status>
            )
          ) : (
            <>
              {attended ? (
                <Status type="marked">
                  Marked attended <Tick />
                </Status>
              ) : (
                <Status>Not marked attended</Status>
              )}
            </>
          )}
        </ParticipantWrapper>
      )}
    </GlobalConsumer>
  )
}

export default Participant
