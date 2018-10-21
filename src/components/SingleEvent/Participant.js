import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import { PARTICIPANT_STATUS, calculateNumAttended } from '@noblocknoparty/shared'

import { Mutation } from 'react-apollo'
import TwitterAvatar from '../User/TwitterAvatar'

import { MarkUserAttended, UnmarkUserAttended } from '../../graphql/mutations'
import { toEthVal } from '../../utils/units'
import { calculateWinningShare } from '../../utils/parties'
import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'
// import EtherScanLink from '../ExternalLinks/EtherScanLink'

// const ParticipantName = styled('div')`
//   font-size: 12px;
//   font-weight: 700;
//   color: #3d3f50;
//   text-align: center;
// `

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

const ParticipantRealName = styled('div')`
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 10px;
  color: #ccc;
  margin-top: 5px;
  text-align: center;
`

const Status = styled('div')`
  ${({ type }) => {
    switch (type) {
      case 'won':
        return `
          color: #5cca94;
          background-color: #e7f7ef;
        `
      case 'lost':
        return `
          color: #6E76FF;
          background-color: #F4F5FF;
        `
      default:
        return ``
    }
  }} font-size: 12px;
  padding: 5px;
  border-radius: 4px;
  text-align: center;
`

export class Participant extends Component {
  render() {
    const {
      participant,
      party,
      markAttended,
      unmarkAttended,
      amAdmin
    } = this.props
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
              {user.realName ? (
                <ParticipantRealName>{user.realName}</ParticipantRealName>
              ) : null}
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
              amAdmin && (
                <Fragment>
                  {attended ? (
                    <Button
                      wide
                      onClick={unmarkAttended}
                      analyticsId="Unmark Attendee"
                    >
                      Unmark attended
                    </Button>
                  ) : (
                    <Button
                      wide
                      onClick={markAttended}
                      analyticsId="Mark Attendee"
                    >
                      Mark attended
                    </Button>
                  )}
                </Fragment>
              )
            )}
          </ParticipantWrapper>
        )}
      </GlobalConsumer>
    )
  }
}

class ParticipantContainer extends Component {
  render() {
    const { party, participant } = this.props
    return (
      <Mutation
        mutation={UnmarkUserAttended}
        variables={{
          address: party.address,
          participant: {
            address: participant.user.address,
            status: PARTICIPANT_STATUS.REGISTERED
          }
        }}
      >
        {unmarkAttended => (
          <Mutation
            mutation={MarkUserAttended}
            variables={{
              address: party.address,
              participant: {
                address: participant.user.address,
                status: PARTICIPANT_STATUS.SHOWED_UP
              }
            }}
          >
            {markAttended => (
              <Participant
                markAttended={markAttended}
                unmarkAttended={unmarkAttended}
                {...this.props}
              />
            )}
          </Mutation>
        )}
      </Mutation>
    )
  }
}

export default ParticipantContainer
