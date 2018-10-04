import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import Participant from './Participant'
import GetMarkedAttendedQuery from './GetMarkedAttendedQuery'
import { H3 } from '../Typography/Basic'

const EventParticipantsContainer = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 20px;
`

const NoAttendees = styled('div')``

class EventParticipants extends Component {
  render() {
    const { participants, search, party } = this.props
    const searchTerm = search.toLowerCase()
    return (
      <GetMarkedAttendedQuery variables={{ contractAddress: party.address }}>
        {markAttendedSingle => (
          <Fragment>
            <H3>Attendees</H3>
            <EventParticipantsContainer>
              {participants.length > 0 ? (
                participants
                  .filter(
                    participant =>
                      participant.participantName
                        .toLowerCase()
                        .includes(searchTerm) ||
                      participant.address.toLowerCase().includes(searchTerm)
                  )
                  .map((participant, i) => (
                    <Participant
                      participant={participant}
                      party={party}
                      key={participant.address + i}
                      markedAttendedList={markAttendedSingle || []}
                    />
                  ))
              ) : (
                <NoAttendees>No one is attending.</NoAttendees>
              )}
            </EventParticipantsContainer>
          </Fragment>
        )}
      </GetMarkedAttendedQuery>
    )
  }
}

export default EventParticipants
