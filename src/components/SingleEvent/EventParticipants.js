import React, { PureComponent, Fragment } from 'react'
import styled from 'react-emotion'
import Participant from './Participant'
import GetMarkedAttendedQuery from './GetMarkedAttendedQuery'
import { H3 } from '../Typography/Basic'

const EventParticipantsContainer = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 10px;
`

class EventParticipants extends PureComponent {
  render() {
    const { participants, search, party } = this.props
    const searchTerm = search.toLowerCase()
    return (
      <GetMarkedAttendedQuery variables={{ contractAddress: party.address }}>
        {markAttendedSingle => (
          <Fragment>
            <H3>Attendees</H3>
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
