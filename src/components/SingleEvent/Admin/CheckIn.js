import React, { useState } from 'react'
import styled from '@emotion/styled'

import Button from '../../Forms/Button'
import TextInput from '../../Forms/TextInput'
import Label from '../../Forms/Label'

import { withApollo } from 'react-apollo'
import { POAP_USERS_SUBGRAPH_QUERY } from '../../../graphql/queries'
import { PARTICIPANT_STATUS } from '@wearekickback/shared'
import { MARK_USER_ATTENDED } from '../../../graphql/mutations'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/amxx/poap'
})
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

export default withApollo(function CheckIn({ party, client }) {
  const [poapId, setPoapId] = useState('')

  const checkIn = async () => {
    const {
      data: { event }
    } = await graphClient.query({
      query: POAP_USERS_SUBGRAPH_QUERY,
      variables: { eventId: poapId }
    })
    const addresses = event.tokens.map(t => t.owner.id)

    const newAttendees = party.participants.filter(
      participant =>
        addresses.includes(participant.user.address) &&
        participant.status === PARTICIPANT_STATUS.REGISTERED
    )
    newAttendees.forEach(participant =>
      client.mutate({
        mutation: MARK_USER_ATTENDED,
        variables: {
          address: party.address,
          participant: {
            address: participant.user.address,
            status: PARTICIPANT_STATUS.SHOWED_UP
          }
        }
      })
    )
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
          />
        </EventIdInputContainer>
        <Button onClick={() => checkIn()}>Start Check In</Button>
      </Section>
    </>
  )
})
