import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from 'react-apollo'
import styled from '@emotion/styled'
import useInterval from 'use-interval'
import { throttle } from 'lodash'

import Button from '../../Forms/Button'
import TextInput from '../../Forms/TextInput'
import Label from '../../Forms/Label'

import { withApollo } from 'react-apollo'
import {
  POAP_USERS_SUBGRAPH_QUERY,
  POAP_EVENT_NAME_QUERY
} from '../../../graphql/queries'
import { PARTICIPANT_STATUS } from '@wearekickback/shared'
import { MARK_USER_ATTENDED } from '../../../graphql/mutations'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai'
})
const POAP_ADDRESS = '0x22c1f6050e56d2876009903609a2cc3fef83b415'
const graphClient = new ApolloClient({ cache, link })

const Section = styled('section')`
  margin-bottom: 40px;
`

const EventIdInputContainer = styled('div')`
  display: flex;
  margin-bottom: 20px;
`

const EventIdInput = styled(TextInput)`
  margin: 0;
  margin-right: 20px;
`

const POAPList = styled('ul')`
  margin-left: 2em;
`

export default withApollo(function CheckIn({ party, client }) {
  const [poapId, setPoapId] = useState('')
  const [eventId, setEventId] = useState('')
  const [newAttendees, setNewAttendees] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const { data: poapEventName } = useQuery(POAP_EVENT_NAME_QUERY, {
    variables: { eventId },
    skip: !eventId
  })
  useInterval(
    () => {
      const [attendee, ...rest] = newAttendees
      client.mutate({
        mutation: MARK_USER_ATTENDED,
        variables: {
          address: party.address,
          participant: {
            address: attendee.user.address,
            status: PARTICIPANT_STATUS.SHOWED_UP
          }
        }
      })
      setNewAttendees(rest)
      if (rest.length === 0) {
        setIsRunning(false)
      }
    },
    newAttendees.length > 0 && isRunning ? 1000 : null
  )

  const loadPOAPUser = async () => {
    const {
      data: { event }
    } = await graphClient.query({
      query: POAP_USERS_SUBGRAPH_QUERY,
      variables: { eventId: poapId }
    })
    const addresses = (event && event.tokens.map(t => t.owner.id)) || []
    const tokens = (event && event.tokens) || []
    const _newAttendees = party.participants
      .map(participant => {
        let token = tokens.filter(
          t => t.owner.id === participant.user.address
        )[0]
        if (token) {
          participant.poapTokenId = token.id
        }
        return participant
      })
      .filter(
        participant =>
          addresses.includes(participant.user.address) &&
          participant.status === PARTICIPANT_STATUS.REGISTERED
      )
    setIsRunning(false)
    setNewAttendees(_newAttendees)
    setEventId(poapId)
  }
  return (
    <>
      <Section>
        <Label>Automatic POAP check in (experimental)</Label>
        <p>
          If you are distributing NFTs using{' '}
          <a href={'https://poap.xyz'}>POAP</a>, then you can check in your
          attendees automatically.
        </p>

        <p>
          Just enter your POAP event ID here so that it matches what is shown{' '}
          <a href={'https://app.poap.xyz/admin/events'}>here</a> and Kickback
          will mark users who received a POAP badge as attendees.
        </p>

        <p>
          You should only use this after users have had enough time to claim
          their NFTs!
        </p>
      </Section>
      <Section>
        <Label>Check in</Label>
        <p>Enter your event ID and click below to check in your attendees.</p>

        <EventIdInputContainer>
          <EventIdInput
            onChangeText={value => setPoapId(value)}
            placeholder="POAP Event ID"
            type="number"
            value={poapId}
          />
        </EventIdInputContainer>
        {poapEventName && (
          <div>
            <img
              width="50px"
              src={
                poapEventName.poapEventName &&
                poapEventName.poapEventName.image_url
              }
            ></img>
            <a href={`https://poap.gallery/event/${poapId}`} target="_blank">
              {eventId}:
              {poapEventName.poapEventName && poapEventName.poapEventName.name}
            </a>
          </div>
        )}
        <Button disabled={isRunning} onClick={() => loadPOAPUser()}>
          Load POAP users
        </Button>
        <Button
          disabled={isRunning || newAttendees.length === 0}
          onClick={() => setIsRunning(true)}
        >
          Mark Check In
        </Button>
        <Button
          disabled={!poapId}
          onClick={() => {
            setPoapId('')
            setEventId('')
            setNewAttendees([])
            setIsRunning(false)
          }}
        >
          Clear
        </Button>
      </Section>
      <Section>
        {isRunning ? <span>Auto checking in....</span> : ''}
        {newAttendees.length} POAP tokens to claim.
        <POAPList>
          {newAttendees.map(a => {
            const url = `https://opensea.io/assets/${POAP_ADDRESS}/${a.poapTokenId}`
            return (
              <li>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {a.poapTokenId}
                </a>{' '}
                {a.user.username} {a.user.address.slice(0, 4)}...
              </li>
            )
          })}
        </POAPList>
      </Section>
    </>
  )
})
