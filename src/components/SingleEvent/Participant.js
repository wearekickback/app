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
  mutation markAttended($address: String) {
    markAttended(address: $address) @client
  }
`

const UNMARK_ATTENDED = gql`
  mutation unmarkAttended($address: String) {
    unmarkAttended(address: $address) @client
  }
`

class Participant extends Component {
  render() {
    const { participant, party } = this.props
    const { participantName, address, paid, attended } = participant
    const { registered, attended: attendedCount, deposit, ended } = party

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
        ) : (
          <Mutation mutation={UNMARK_ATTENDED} variables={{ address: address }}>
            {unmarkAttended => (
              <Mutation
                mutation={MARK_ATTENDED}
                variables={{ address: address }}
              >
                {markAttended => (
                  <Fragment>
                    <div onClick={markAttended}>Attend</div>
                    <div onClick={unmarkAttended}>UnAttend</div>
                  </Fragment>
                )}
              </Mutation>
            )}
          </Mutation>
        )}
      </ParticipantContainer>
    )
  }
}

const ParticipantContainer = styled('div')``

export default Participant
