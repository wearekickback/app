import React, { Fragment, useState } from 'react'
import styled from '@emotion/styled'

import { pluralize } from '@wearekickback/shared'
import Participant from './Participant'
import DefaultEventFilters from './EventFilters'

import { H3 } from '../Typography/Basic'
import { sortParticipants, filterParticipants } from '../../utils/parties'
import {
  GET_CONTRIBUTIONS_BY_PARTY,
  SNAPSHOT_VOTES_SUBGRAPH_QUERY
} from '../../graphql/queries'
import SafeQuery from '../SafeQuery'
import { useQuery } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import _ from 'lodash'

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'https://hub.snapshot.page/graphql'
})
const graphClient = new ApolloClient({ cache, link })

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

const spotsLeft = ({ ended, participants, participantLimit }) => {
  if (ended) {
    return null
  } else {
    const spotsLeft = participantLimit - participants.length
    return `- ${participants.length} going, ${spotsLeft} ${pluralize(
      'spot',
      spotsLeft
    )} left`
  }
}

const EventParticipants = props => {
  const {
    party,
    party: { participants, ended },
    amAdmin
  } = props

  const [search, setSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState(null)
  const spots = spotsLeft(party)

  const handleSearch = search => {
    setSearch((search || '').toLowerCase())
  }
  const { data: snapshotData } = useQuery(SNAPSHOT_VOTES_SUBGRAPH_QUERY, {
    variables: { userAddresses: participants.map(p => p.user.address) },
    client: graphClient
  })

  return (
    <SafeQuery
      query={GET_CONTRIBUTIONS_BY_PARTY}
      variables={{ address: party.address }}
    >
      {({ data, loading }) => {
        return (
          <Fragment>
            <H3>
              Participants <Spots>{spots}</Spots>
            </H3>
            <EventFilters
              handleSearch={handleSearch}
              handleFilterChange={setSelectedFilter}
              amAdmin={amAdmin}
              search={search}
              // enableQrCodeScanner={amAdmin}
              ended={ended}
            />
            <EventParticipantsContainer>
              {participants.length > 0 ? (
                participants
                  .sort(sortParticipants)
                  .filter(filterParticipants(selectedFilter, search))
                  .map(participant => {
                    let votes =
                      snapshotData &&
                      snapshotData.votes
                        .filter(v => {
                          return (
                            v.voter.toLowerCase() ==
                            participant.user.address.toLowerCase()
                          )
                        })
                        .map(v => {
                          return {
                            id: v.space.id,
                            avatar: v.space.avatar,
                            created: v.created
                          }
                        })
                    let spaces = {}
                    votes &&
                      votes.map(v => {
                        if (!spaces[v.id] || v.created > spaces[v.id].created) {
                          spaces[v.id] = v
                        }
                      })
                    let filteredSpaces = _.sortBy(Object.values(spaces), [
                      function(o) {
                        return o.created
                      }
                    ]).reverse()

                    return (
                      <Participant
                        amAdmin={amAdmin}
                        participant={participant}
                        contributions={data && data.getContributionsByParty}
                        spaces={filteredSpaces.slice(0, 5)}
                        party={party}
                        key={`${participant.address}${participant.index}`}
                      />
                    )
                  })
              ) : (
                <NoParticipants>No one is attending.</NoParticipants>
              )}
            </EventParticipantsContainer>
          </Fragment>
        )
      }}
    </SafeQuery>
  )
}

export default EventParticipants
