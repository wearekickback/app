import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolution'

import SafeMutation from '../SafeMutation'
import { PARTICIPANT_STATUS } from '../../utils/status'
import { getSocial } from '../../utils/parties'
import { MarkUserAttended, UnmarkUserAttended } from '../../graphql/mutations'
import { toEthVal } from '../../utils/units'
import {
  calculateWinningShare,
  calculateNumAttended
} from '../../utils/parties'
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
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TwitterAvatar = styled('img')`
  border-radius: 50%;
  width: 61px;
  margin-bottom: 15px;
`

const ParticipantAddress = styled('div')`
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 10px;
  font-size: 12px;
  color: #3d3f50;
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

    const twitter = getSocial(user.social, 'twitter')

    const numRegistered = party.participants.length
    const numShowedUp = calculateNumAttended(party.participants)

    const payout = calculateWinningShare(deposit, numRegistered, numShowedUp)

    return (
      <GlobalConsumer>
        {({ userAddress, loggedIn }) => (
          <ParticipantWrapper>
            <TwitterAvatar
              src={`https://avatars.io/twitter/${twitter}/medium`}
            />
            <ParticipantAddress>
              <ReverseResolution address={user.address} />
            </ParticipantAddress>
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
                    <Button wide onClick={unmarkAttended}>
                      Unmark attended
                    </Button>
                  ) : (
                    <Button wide onClick={markAttended}>
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
      <SafeMutation
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
          <SafeMutation
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
          </SafeMutation>
        )}
      </SafeMutation>
    )
  }
}

export default ParticipantContainer
