import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'

import { pluralize, PARTICIPANT_STATUS } from '@noblocknoparty/shared'
import Participant from './Participant'
import EventFilters from './EventFilters'

import { H3 } from '../Typography/Basic'

const EventParticipantsContainer = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 20px;
  margin-bottom: 40px;
`
const NoParticipants = styled('div')``

const Spots = styled('span')`
  font-size: 70%;
`

class EventParticipants extends Component {
  state = {
    search: '',
    selectedFilter: null
  }

  handleFilterChange = selectedFilter => {
    this.setState({ selectedFilter })
  }

  handleSearch = event => {
    this.setState({
      search: event.target.value
    })
  }

  render() {
    const {
      party,
      party: { participants, participantLimit, ended },
      amAdmin
    } = this.props

    const { selectedFilter } = this.state

    const lowerSearch = this.state.search.toLowerCase()

    participants.sort((a, b) => {
      return a.index < b.index ? -1 : 1
    })

    let spots

    if (ended) {
      spots = `${participants.length} out of ${participantLimit} attended`
    } else {
      const spotsLeft = participantLimit - participants.length
      spots = `${participants.length} going, ${spotsLeft} ${pluralize(
        'spot',
        spotsLeft
      )} left`
    }

    return (
      <Fragment>
        <H3>
          Participants - <Spots>{spots}</Spots>
        </H3>
        <EventFilters
          handleSearch={this.handleSearch}
          handleFilterChange={this.handleFilterChange}
          amAdmin={amAdmin}
          search={this.state.search}
          enableQrCodeScanner={amAdmin}
          ended={ended}
        />
        <EventParticipantsContainer>
          {participants.length > 0 ? (
            participants
              .sort((a, b) => (a.index < b.index ? -1 : 1))
              .filter(p => {
                //TODO: allow this to handle multiple filters
                if (
                  selectedFilter &&
                  selectedFilter.value === 'unmarked' &&
                  p.status !== PARTICIPANT_STATUS.REGISTERED
                ) {
                  return false
                }

                if (
                  selectedFilter &&
                  selectedFilter.value === 'marked' &&
                  p.status === PARTICIPANT_STATUS.REGISTERED
                ) {
                  return false
                }
                return (
                  (p.user.realName || '').toLowerCase().includes(lowerSearch) ||
                  (p.user.username || '').toLowerCase().includes(lowerSearch) ||
                  p.user.address.toLowerCase().includes(lowerSearch)
                )
              })
              .map(participant => (
                <Participant
                  amAdmin={amAdmin}
                  participant={participant}
                  party={party}
                  key={`${participant.address}${participant.index}`}
                />
              ))
          ) : (
            <NoParticipants>No one is attending.</NoParticipants>
          )}
        </EventParticipantsContainer>
      </Fragment>
    )
  }
}

export default EventParticipants
