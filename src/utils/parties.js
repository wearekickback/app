import { addressesMatch } from '@noblocknoparty/shared'

import { toEthVal } from './units'

export const amParticipant = (participants, address) =>
  participants.find(a => addressesMatch(a.user.address, address))

export const amInAddressList = (addressList, address) =>
  addressList.find(a => addressesMatch(a, address))

export const calculateWinningShare = (deposit, numRegistered, numAttended) =>
  toEthVal(deposit)
    .mul(numRegistered)
    .div(numAttended)
    .toEth()
    .toFixed(3)
