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

class Participant extends Component {
  render() {
    const { participant, party, markedAttendedList } = this.props
    const { participantName, address, paid, attended } = participant
    const {
      registered,
      attended: attendedCount,
      deposit,
      ended,
      address: contractAddress
    } = party

    const isMarked = markedAttendedList.includes(address.toLowerCase())

    return (
      <ParticipantContainer>
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
                  <Fragment>
                    {isMarked ? (
                      <div onClick={unmarkAttended}>UnAttend</div>
                    ) : (
                      <div onClick={markAttended}>Attend</div>
                    )}
                  </Fragment>
                )}
              </Mutation>
            )}
          </Mutation>
        ) : (
          'marked as attended'
        )}
      </ParticipantContainer>
    )
  }
}

const ParticipantContainer = styled('div')``

export default Participant
