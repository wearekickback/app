import React, { Component } from 'react'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolution'

const TwitterAvatar = styled('img')`
  border-radius: 50%;
  width: 50px;
`

class Participant extends Component {
  render() {
    const { participant } = this.props
    const { participantName, address, attended, paid } = participant
    return (
      <ParticipantContainer>
        <div>{participantName}</div>
        <TwitterAvatar
          src={`https://avatars.io/twitter/${participantName}/medium`}
        />
        <div>
          <ReverseResolution address={address} />
        </div>
        <div>{attended.toString()}</div>
        <div>{paid.toString()}</div>
      </ParticipantContainer>
    )
  }
}

const ParticipantContainer = styled('div')``

export default Participant
