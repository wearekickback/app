import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'

import { pluralize } from '@wearekickback/shared'
import Participant from './Participant'
import DefaultEventFilters from './EventFilters'

import { H3 } from '../Typography/Basic'
import { sortParticipants, filterParticipants } from '../../utils/parties'

const EventParticipantsContainer = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 20px;
  margin-bottom: 40px;
`

const EventFilters = styled(DefaultEventFilters)`
  margin-bottom: 20px;
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

  handleSearch = search => {
    this.setState({
      search: (search || '').toLowerCase()
    })
  }

  render() {
    const {
      party,
      party: { participants, participantLimit, ended },
      amAdmin
    } = this.props

    const { selectedFilter, search } = this.state

    let spots

    if (ended) {
      spots = null
    } else {
      const spotsLeft = participantLimit - participants.length
      spots = `- ${participants.length} going, ${spotsLeft} ${pluralize(
        'spot',
        spotsLeft
      )} left`
    }

    return (
      <Fragment>
        <H3>
          Participants <Spots>{spots}</Spots>
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
              .sort(sortParticipants)
              .filter(filterParticipants(selectedFilter, search))
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
