import React, { Fragment, useState, useEffect } from 'react'
import styled from '@emotion/styled'

import { pluralize } from '@wearekickback/shared'
import Participant from './Participant'
import DefaultEventFilters from './EventFilters'

import { H3 } from '../Typography/Basic'
import { sortParticipants, filterParticipants } from '../../utils/parties'
import {
  GET_CONTRIBUTIONS_BY_PARTY,
  SNAPSHOT_VOTES_SUBGRAPH_QUERY,
  POAP_USERS_SUBGRAPH_QUERY,
  POAP_EVENT_NAME_QUERY
} from '../../graphql/queries'
import SafeQuery from '../SafeQuery'
import { useQuery } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import _ from 'lodash'
import { parseAvatar, participantsLength } from '../../api/utils'
import { fetchAndSetPoapAddresses } from './utils'
const graphClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: 'https://hub.snapshot.org/graphql' })
})

const poapGraphClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai'
  })
})

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
    const totalReg = participantsLength(participants)
    const spotsLeft = participantLimit - totalReg
    return `- ${totalReg} going, ${spotsLeft} ${pluralize(
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
  const [poapAddresses, setPoapAddresses] = useState('')
  const poapIds =
    party.optional && party.optional.poapId.split(',').map(p => p.trim())

  useEffect(() => {
    fetchAndSetPoapAddresses(setPoapAddresses, poapIds)
  }, [])

  console.log({ poapAddresses })
  const handleSearch = search => {
    setSearch((search || '').toLowerCase())
  }
  const userAddresses = participants.map(p => p.user.address)
  const { data: snapshotData } = useQuery(SNAPSHOT_VOTES_SUBGRAPH_QUERY, {
    variables: { userAddresses },
    skip: userAddresses.length === 0,
    client: graphClient
  })
  console.log({ snapshotData })
  const spaces = {}
  snapshotData &&
    snapshotData.votes.map(s => {
      if (spaces[s.space.id]) {
        spaces[s.space.id].voters.push(s.voter)
      } else {
        spaces[s.space.id] = {
          voters: [s.voter],
          avatar: s.space.avatar
        }
      }
    })
  console.log({ party, spaces })
  const stats = Object.keys(spaces)
    .map(k => {
      return [k, _.uniq(spaces[k].voters).length]
    })
    .sort((a, b) => {
      return b[1] - a[1]
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
                            avatar: parseAvatar(v.space.avatar),
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
                        hasPOAP={!!poapAddresses[participant.user.address]}
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
            <div>
              {stats.length > 0 && (
                <div>
                  <h3>Top Governance participations</h3>
                  <ul>
                    {stats.slice(0, 10).map(([k, v]) => {
                      return (
                        <li>
                          {k} has {v} participant{parseInt(v) > 1 && 's'}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </Fragment>
        )
      }}
    </SafeQuery>
  )
}

export default EventParticipants
