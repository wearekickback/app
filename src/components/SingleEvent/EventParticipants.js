import React, { Component } from 'react'
import styled from 'react-emotion'
import Participant from './Participant'
import { Query } from 'react-apollo'
import { GET_MARKED_ATTENDED_SINGLE } from '../../graphql/queries'

class EventParticipants extends Component {
  render() {
    const { participants, search, party } = this.props
    const searchTerm = search.toLowerCase()
    console.log(party.address)
    return (
      <Query
        query={GET_MARKED_ATTENDED_SINGLE}
        variables={{ contractAddress: party.address }}
      >
        {({ data: { markAttendedSingle } }) => (
          <EventParticipantsContainer>
            {console.log(markAttendedSingle)}
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
      </Query>
    )
  }
}

const EventParticipantsContainer = styled('div')``

export default EventParticipants
