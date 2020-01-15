import React from 'react'
import styled from 'react-emotion'

import Label from '../../Forms/Label'
import Clear from './Clear'
import Finalize from './Finalize'
import SetLimit from './SetLimit'
import ChangeDeposit from './ChangeDeposit'
import AddAdmin from './AddAdmin'

const Section = styled('section')`
  margin-bottom: 40px;
`

const AdminIntro = styled('p')`
  background-color: #ccc;
  padding: 1em;
  border-radius: 5px;
  color: #000;
`

export default function SmartContractFunctions({ party }) {
  return (
    <>
      <AdminIntro>
        These are the administrative functions for this event. Please be
        careful!
      </AdminIntro>
      <Section>
        <Label>Finalize</Label>
        {party.ended ? (
          'This party has been finalized'
        ) : (
          <>
            <p>
              Finalize ends the event and allows participants to withdraw. No
              one will be able to be mark attended after you finalize!
            </p>
            <Finalize party={party} />
          </>
        )}
      </Section>
      <Section>
        <Label>Clear</Label>
        <p>
          Clear will return all remaining funds to the host. Participants will
          no longer be able to withdraw.
        </p>
        <Clear address={party.address} />
      </Section>
      <Section>
        <Label>Set Limit</Label>
        <p>
          Set Limit will change the amount of participants that are allowed to
          register for your event (This will take at least 10 min to take
          effects).
        </p>
        <SetLimit
          address={party.address}
          currentLimit={party.participantLimit}
        />
      </Section>
      <Section>
        <Label>Change commitment</Label>
        <p>
          Change the commitment amount. You can do so until the first person
          does RSVP (This will take at least 10 min to take effects).
        </p>
        <ChangeDeposit
          address={party.address}
          currentDeposit={party.deposit}
          numParticipants={party.participants.length}
        />
      </Section>
      <Label>
        Add Admins (click + to add multiple admins in 1 transactions)
      </Label>
      <p>
        Adding an admin allows that user to mark people as attended. You cannot
        remove an admin once added{' '}
      </p>
      <AddAdmin address={party.address} />
    </>
  )
}
