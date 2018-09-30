import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import Participant from './Participant'
import GetMarkedAttendedQuery from './GetMarkedAttendedQuery'

class EventParticipants extends PureComponent {
  render() {
    const { participants, search, party } = this.props
    const searchTerm = search.toLowerCase()
    return (
      <GetMarkedAttendedQuery variables={{ contractAddress: party.address }}>
        {markAttendedSingle => (
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
        )}
      </GetMarkedAttendedQuery>
    )
  }
}

const EventParticipantsContainer = styled('div')``

export default EventParticipants
