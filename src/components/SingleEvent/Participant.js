import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { PARTICIPANT_STATUS, calculateNumAttended } from '@wearekickback/shared'

import DefaultTwitterAvatar from '../User/TwitterAvatar'
import Status from './ParticipantStatus'

import { calculateWinningShare } from '../../utils/parties'
import tick from '../svg/tick.svg'
import Currency from './Currency'
import { GlobalConsumer } from '../../GlobalState'

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

const ParticipantWrapper = styled(Link)`
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

const OrgAvatarImg = styled(`img`)`
  width: 15px;
  margin: 2px, 5px;
`

const OrgAvatars = function({ spaces }) {
  return (
    <div>
      {spaces.map(s => (
        <OrgAvatarImg src={s.avatar} alt={s.id} title={s.id}></OrgAvatarImg>
      ))}
    </div>
  )
}

function Participant({
  participant,
  party,
  amAdmin,
  decimals,
  contributions,
  spaces
}) {
  const { user, status } = participant
  const { deposit, ended } = party

  const withdrawn = status === PARTICIPANT_STATUS.WITHDRAWN_PAYOUT
  const attended = status === PARTICIPANT_STATUS.SHOWED_UP || withdrawn

  const numRegistered = party.participants.length
  const numShowedUp = calculateNumAttended(party.participants)

  const payout = calculateWinningShare(deposit, numRegistered, numShowedUp)
  const contribution = contributions.filter(
    c => c.senderAddress === participant.user.address
  )[0]
  return (
    <GlobalConsumer>
      {({ userAddress, loggedIn }) => (
        <ParticipantWrapper to={`/user/${user.username}`} amAdmin={amAdmin}>
          <TwitterAvatar user={user} size={10} scale={6} />
          <ParticipantId>
            <ParticipantUsername>{user.username}</ParticipantUsername>
          </ParticipantId>
          <OrgAvatars spaces={spaces} />
          {ended ? (
            attended ? (
              contribution ? (
                <Status type="contributed">
                  <span role="img" aria-label="sheep">
                    🎁&nbsp;
                  </span>
                  <Currency
                    amount={contribution.amount}
                    tokenAddress={party.tokenAddress}
                    precision={3}
                  />
                </Status>
              ) : (
                <Status type="won">
                  {`${withdrawn ? ' Withdrew' : 'Won'} `}
                  <Currency
                    amount={payout}
                    tokenAddress={party.tokenAddress}
                    precision={3}
                  />
                </Status>
              )
            ) : (
              <Status type="lost">
                Lost{' '}
                <Currency amount={deposit} tokenAddress={party.tokenAddress} />{' '}
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
