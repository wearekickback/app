import React, { useState } from 'react'
import styled from 'react-emotion'

import Button from '../../Forms/Button'
import TextInput from '../../Forms/TextInput'
import Label from '../../Forms/Label'

import { withApollo } from 'react-apollo'
import { POAP_USERS_QUERY } from '../../../graphql/queries'
import { MARK_USER_ATTENDED } from '../../../graphql/mutations'

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
      data: { addresses }
    } = await client.query({
      query: POAP_USERS_QUERY,
      variables: { eventId: poapId }
    })

    const attendees = party.participants.filter(participant =>
      addresses.includes(participant.user.address)
    )

    attendees.map(participant =>
      client.mutation({
        mutation: MARK_USER_ATTENDED,
        variables: { address: party.address, participant }
      })
    )
  }

  return (
    <>
      <Section>
        <Label>Automatic POAP check in</Label>
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
