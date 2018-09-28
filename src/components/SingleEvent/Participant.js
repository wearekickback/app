import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolution'
import { winningShare } from './utils'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const TwitterAvatar = styled('img')`
  border-radius: 50%;
  width: 50px;
`

const ParticipantAddress = styled('div')``

const WinningShare = styled('div')``

const MARK_ATTENDED = gql`
  mutation markAttended($address: String, $contractAddress: String) {
    markAttended(address: $address, contractAddress: $contractAddress) @client
  }
`

const UNMARK_ATTENDED = gql`
  mutation unmarkAttended($address: String, $contractAddress: String) {
    unmarkAttended(address: $address, contractAddress: $contractAddress) @client
  }
`

export class Participant extends Component {
  render() {
    const {
      participant,
      party,
      markedAttendedList,
      markAttended,
      unmarkAttended
    } = this.props
    const { participantName, address, paid, attended } = participant
    const { registered, attended: attendedCount, deposit, ended } = party

    const isMarked = markedAttendedList.includes(address.toLowerCase())

    return (
      <ParticipantWrapper>
        <div>{participantName}</div>
        <TwitterAvatar
          src={`https://avatars.io/twitter/${participantName}/medium`}
        />
        <ParticipantAddress>
          <ReverseResolution address={address} />
        </ParticipantAddress>

        {ended ? (
          <WinningShare>
            {attended
              ? `won ${winningShare(
                  deposit,
                  registered,
                  attendedCount
                )} ${paid && 'and withdrawn'}`
              : `lost ${deposit}`}
          </WinningShare>
        ) : !attended ? (
          <Fragment>
            {isMarked ? (
              <div onClick={unmarkAttended}>UnAttend</div>
            ) : (
              <div onClick={markAttended}>Attend</div>
            )}
          </Fragment>
        ) : (
          'marked as attended'
        )}
      </ParticipantWrapper>
    )
  }
}

const ParticipantWrapper = styled('div')``

class ParticipantContainer extends Component {
  render() {
    const { address, contractAddress } = this.props
    return (
      <Mutation
        mutation={UNMARK_ATTENDED}
        variables={{ address, contractAddress }}
        refetchQueries={['getMarkedAttendedSingle']}
      >
        {unmarkAttended => (
          <Mutation
            mutation={MARK_ATTENDED}
            variables={{ address, contractAddress }}
            refetchQueries={['getMarkedAttendedSingle']}
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
