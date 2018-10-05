import React, { Component, Fragment } from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolution'

import { ATTENDEE_STATUS } from '../../constants/status'
import { MarkUserAttended, UnmarkUserAttended } from '../../graphql/mutations'
import { winningShare } from '../../utils/calculations'
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

export class Attendee extends Component {
  render() {
    const {
      attendee,
      party,
      markAttended,
      unmarkAttended
    } = this.props
    const { user, status } = attendee
    const { deposit, ended } = party

    const attended = (status === ATTENDEE_STATUS.SHOWED_UP)
    const withdrawn = (status === ATTENDEE_STATUS.WITHDRAWN_PAYOUT)

    const { value: twitter } = (user.social || []).find(({ type }) => type === 'twitter') || {}

    const numRegistered = party.attendees.length
    const numShowedUp = party.attendees.reduce((m, { status }) => (
      m + (status === (ATTENDEE_STATUS.SHOWED_UP || ATTENDEE_STATUS.WITHDRAWN_PAYOUT) ? 1 : 0)
    ), 0)

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
                <Status type="won">{`${withdrawn ? ' Withdrew' : 'Won'} ${winningShare(
                  deposit,
                  numRegistered,
                  numShowedUp
                )} ETH `}</Status>
              ) : (
                <Status type="lost">Lost {deposit} ETH</Status>
              )
            ) : (
              <Fragment>
                {attended ? (
                  <Button wide onClick={unmarkAttended}>Unmark attended</Button>
                ) : (
                  <Button wide onClick={markAttended}>Mark attended</Button>
                )}
              </Fragment>
            )}
          </ParticipantWrapper>
        )}
      </GlobalConsumer>
    )
  }
}

class AttendeeContainer extends Component {
  render() {
    const { party, attendee } = this.props
    return (
      <Mutation
        mutation={UnmarkUserAttended}
        variables={{
          address: party.address,
          attendee: {
            address: attendee.user.address,
            status: ATTENDEE_STATUS.REGISTERED,
          }
        }}
        refetchQueries={['getMarkedAttendedSingle']}
      >
        {unmarkAttended => (
          <Mutation
            mutation={MarkUserAttended}
            variables={{
              address: party.address,
              attendee: {
                address: attendee.user.address,
                status: ATTENDEE_STATUS.SHOWED_UP,
              }
            }}
            refetchQueries={['getMarkedAttendedSingle']}
          >
            {markAttended => (
              <Attendee
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

export default AttendeeContainer
