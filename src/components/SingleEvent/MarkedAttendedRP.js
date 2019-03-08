import React from 'react'
import { Mutation } from 'react-apollo'
import { PARTICIPANT_STATUS } from '@wearekickback/shared'
import {
  MARK_USER_ATTENDED,
  UNMARK_USER_ATTENDED
} from '../../graphql/mutations'

export default function MarkedAttendedRP({
  children,
  party,
  participant,
  refetch
}) {
  return (
    <Mutation
      mutation={UNMARK_USER_ATTENDED}
      variables={{
        address: party.address,
        participant: {
          address: participant.user.address,
          status: PARTICIPANT_STATUS.REGISTERED
        }
      }}
    >
      {unmarkAttended => (
        <Mutation
          mutation={MARK_USER_ATTENDED}
          variables={{
            address: party.address,
            participant: {
              address: participant.user.address,
              status: PARTICIPANT_STATUS.SHOWED_UP
            }
          }}
        >
          {markAttended => children({ markAttended, unmarkAttended })}
        </Mutation>
      )}
    </Mutation>
  )
}
