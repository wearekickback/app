import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolution'
import { winningShare } from './utils'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const ParticipantWrapper = styled('div')`
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TwitterAvatar = styled('img')`
  border-radius: 50%;
  width: 61px;
`

const ParticipantAddress = styled('div')`
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
        <TwitterAvatar
          src={`https://avatars.io/twitter/${participantName}/medium`}
        />
        <div>{participantName}</div>
        <ParticipantAddress>
          <ReverseResolution address={address} />
        </ParticipantAddress>
        {ended ? (
          attended ? (
            <Status type="won">{`${paid ? ' withdrew' : 'won'} ${winningShare(
              deposit,
              registered,
              attendedCount
            )} ETH `}</Status>
          ) : (
            <Status type="lost">lost {deposit} ETH</Status>
          )
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
