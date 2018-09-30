import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import Participant from './Participant'
import GetMarkedAttendedQuery from './GetMarkedAttendedQuery'
import { H2 } from '../Typography/Basic'

const EventParticipantsContainer = styled('div')`
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-gap: 10px;
`

class EventParticipants extends Component {
  render() {
    const { participants, search, party } = this.props
    const searchTerm = search.toLowerCase()
    return (
      <GetMarkedAttendedQuery variables={{ contractAddress: party.address }}>
        {markAttendedSingle => (
          <Fragment>
            <H2>Attendees</H2>
            <EventParticipantsContainer>
              {participants
                .filter(
                  participant =>
                    participant.participantName
                      .toLowerCase()
                      .includes(searchTerm) ||
                    participant.address.toLowerCase().includes(searchTerm)
                )
                .map(participant => (
                  <Participant
                    participant={participant}
                    party={party}
                    key={participant.address}
                    markedAttendedList={markAttendedSingle || []}
                  />
                ))}
            </EventParticipantsContainer>
          </Fragment>
        )}
      </GetMarkedAttendedQuery>
    )
  }
}

export default EventParticipants
