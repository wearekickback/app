import _ from 'lodash'
import {
  addressesMatch,
  userHasEventRole,
  PARTICIPANT_STATUS,
  ROLE
} from '@wearekickback/shared'

import { toEthVal } from './units'

export const getMyParticipantEntry = (party, address) =>
  address
    ? (_.get(party, 'participants') || []).find(a =>
        addressesMatch(_.get(a, 'user.address', ''), address)
      )
    : null

export const getParticipantsMarkedAttended = participants =>
  participants.reduce(
    (a, c) =>
      c.status === PARTICIPANT_STATUS.SHOWED_UP ||
      c.status === PARTICIPANT_STATUS.WITHDRAWN_PAYOUT
        ? a + 1
        : a,
    0
  )

export const amAdmin = (party, address) =>
  address && userHasEventRole(address, party, ROLE.EVENT_ADMIN)

export const calculateWinningShare = (deposit, numRegistered, numAttended) =>
  toEthVal(deposit)
    .mul(numRegistered)
    .div(numAttended)
    .toEth()
    .toFixed(3)

export const sortParticipants = (a, b) => (a.index < b.index ? -1 : 1)

export const filterParticipants = (selectedFilter, search) => participant => {
  //TODO: allow this to handle multiple filters
  if (
    selectedFilter &&
    selectedFilter.value === 'unmarked' &&
    participant.status !== PARTICIPANT_STATUS.REGISTERED
  ) {
    return false
  }

  if (
    selectedFilter &&
    selectedFilter.value === 'marked' &&
    participant.status === PARTICIPANT_STATUS.REGISTERED
  ) {
    return false
  }
  return (
    (participant.user.realName || '').toLowerCase().includes(search) ||
    (participant.user.username || '').toLowerCase().includes(search) ||
    participant.user.address.toLowerCase().includes(search)
  )
}
