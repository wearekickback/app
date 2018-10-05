import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolution'
import { winningShare } from './utils'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Button from '../Forms/Button'
import EtherScanLink from '../ExternalLinks/EtherScanLink'

const ParticipantName = styled('div')`
  font-size: 12px;
  font-weight: 700;
  color: #3d3f50;
  text-align: center;
`

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

    console.log(participant)

    return (
      <ParticipantWrapper>
        <TwitterAvatar
          src={`https://avatars.io/twitter/${participantName}/medium`}
        />
        <ParticipantName>{participantName}</ParticipantName>
        <ParticipantAddress>
          <EtherScanLink address={address}>
            <ReverseResolution address={address} />
          </EtherScanLink>
        </ParticipantAddress>
        {ended ? (
          attended ? (
            <Status type="won">{`${paid ? ' Withdrew' : 'Won'} ${winningShare(
              deposit,
              registered,
              attendedCount
            )} ETH `}</Status>
          ) : (
            <Status type="lost">Lost {deposit} ETH</Status>
          )
        ) : !attended ? (
          <Fragment>
            {isMarked ? (
              <Button wide onClick={unmarkAttended}>
                Unmark attended
              </Button>
            ) : (
              <Button wide onClick={markAttended}>
                Mark attended
              </Button>
            )}
          </Fragment>
        ) : (
          <Status type="won">Marked as attended</Status>
        )}
      </ParticipantWrapper>
    )
  }
}

class ParticipantContainer extends Component {
  render() {
    const { party, participant } = this.props
    const { address, contractAddress } = this.props
    console.log(address, contractAddress)
    return (
      <Mutation
        mutation={UNMARK_ATTENDED}
        variables={{
          address: participant.address,
          contractAddress: party.address
        }}
        refetchQueries={['getMarkedAttendedSingle']}
      >
        {unmarkAttended => (
          <Mutation
            mutation={MARK_ATTENDED}
            variables={{
              address: participant.address,
              contractAddress: party.address
            }}
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
