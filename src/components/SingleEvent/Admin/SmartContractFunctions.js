import React from 'react'
import styled from '@emotion/styled'

import Label from '../../Forms/Label'
import Clear from './Clear'
import ClearAndSend from './ClearAndSend'
import Finalize from './Finalize'
import SetLimit from './SetLimit'
import AddAdmin from './AddAdmin'
import moment from 'moment'

const Section = styled('section')`
  margin-bottom: 40px;
`

const AdminIntro = styled('p')`
  background-color: #ccc;
  padding: 1em;
  border-radius: 5px;
  color: #000;
`

const SendAndClear = function({ party }) {
  const coolingPeriod = parseInt(party.coolingPeriod)
  const endOfCoolingPeriod = moment(party.end).add(coolingPeriod, 's')
  const coolingPeriodEnded = endOfCoolingPeriod.isBefore(moment())
  const clearFee = party.clearFee
  const notWithdrawn = party.participants.filter(p => p.status === 'SHOWED_UP')
    .length
  const balance = parseInt(party.balance || 0) / Math.pow(10, 18)
  if (party.ended) {
    if (coolingPeriodEnded) {
      if (notWithdrawn) {
        return (
          <Section>
            <Label>Resend to the user</Label>
            <p>
              Resend all remaining funds ({balance} {party.symbol}) to{' '}
              {notWithdrawn} participants. <br /> Your gas cost is covered by
              taking clear fee ({clearFee / 10} % of payout) from each
              participant.
            </p>
            <ClearAndSend address={party.address} num={notWithdrawn} />
          </Section>
        )
      } else if (balance > 0) {
        return (
          <Section>
            <Label>Clear</Label>
            <p>
              Clear will return all remaining funds ({balance}) to the host.
              Participants will no longer be able to withdraw.
            </p>
            <Clear address={party.address} />
          </Section>
        )
      } else {
        return 'No fund left in this contract'
      }
    } else {
      return `Cooling period ends on ${endOfCoolingPeriod}`
    }
  } else {
    return ''
  }
}

export default function SmartContractFunctions({ party, isAdmin = true }) {
  if (!isAdmin) {
    return <SendAndClear party={party} />
  }

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
      <SendAndClear party={party} />
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
