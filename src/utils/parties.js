import _ from 'lodash'
import { addressesMatch, PARTICIPANT_STATUS } from '@noblocknoparty/shared'

import { toEthVal } from './units'

export const getMyParticipantEntry = (party, address) =>
  _.get(party, 'participants', []).find(a =>
    addressesMatch(_.get(a, 'user.address', ''), address)
  )

export const getParticipantsMarkedAttended = participants =>
  participants.reduce(
    (a, c) =>
      c.status === PARTICIPANT_STATUS.SHOWED_UP ||
      c.status === PARTICIPANT_STATUS.WITHDRAWN_PAYOUT
        ? a + 1
        : a,
    0
  )

export const amOwner = (party, address) =>
  addressesMatch(_.get(party, 'owner.address', ''), address)

export const amAdmin = (party, address) =>
  amOwner(party, address) ||
  (address &&
    amInAddressList(_.get(party, 'admins', []).map(a => a.address), address))

export const amInAddressList = (addressList, address) =>
  addressList.find(a => addressesMatch(a, address))

export const calculateWinningShare = (deposit, numRegistered, numAttended) =>
  toEthVal(deposit)
    .mul(numRegistered)
    .div(numAttended)
    .toEth()
    .toFixed(3)
