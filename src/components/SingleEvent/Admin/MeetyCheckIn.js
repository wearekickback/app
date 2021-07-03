import React, { useState } from 'react'
import styled from '@emotion/styled'

import Button from '../../Forms/Button'
import TextInput from '../../Forms/TextInput'
import Label from '../../Forms/Label'

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

export default function MeetyCheckIn({ party, userAddress }) {
  const [meetyId, setMeetyId] = useState('')
  const [checkedInParticipants, setCheckedInParticipants] = React.useState([])
  const [isRunning, setIsRunning] = useState(false)

  const loadMeetyUser = async () => {
    const response = await fetch(
      `https://meety-backend.herokuapp.com/organizer/${userAddress.toLowerCase()}/events/${meetyId}/checkin`
    )
      .then(res => res.json())
      .catch(err => console.log(err))
    const participants = response.participants
    setCheckedInParticipants(participants)
  }

  return (
    <>
      <Section>
        <Label>Automatic Meety check in (experimental)</Label>
        <p>
          If you are using Meety Checkpoints, then you can check in your
          attendees automatically.
        </p>
        <p>
          Just enter your Meety event ID here so that it matches what is shown
          here and Kickback will mark users who solved the minimum number of
          required quizzes in minimum number of required checkpoint as
          attendees.
        </p>
      </Section>
      <Section>
        <Label>Check in</Label>
        <p>Enter your event ID and click below to check in your attendees.</p>

        <EventIdInputContainer>
          <EventIdInput
            onChangeText={value => setMeetyId(value)}
            placeholder="Meety Event ID"
            type="text"
          />
        </EventIdInputContainer>
        <Button
          disabled={checkedInParticipants.length !== 0}
          onClick={() => loadMeetyUser()}
        >
          Load Meety users
        </Button>
        <Button
          disabled={isRunning || checkedInParticipants.length === 0}
          onClick={() => setIsRunning(true)}
        >
          Mark Check In
        </Button>
      </Section>
      <Section>
        {isRunning ? <span>Auto checking in....</span> : ''}
        <POAPList>
          {checkedInParticipants.map((a, i) => {
            return (
              <li key={i}>
                {a.user.username} {a.user.address.slice(0, 4)}...
              </li>
            )
          })}
        </POAPList>
      </Section>
    </>
  )
}
