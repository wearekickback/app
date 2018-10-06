import { addressesMatch } from './strings'

export const amParticipant = (participants, address) => participants.find(a => addressesMatch(a.user.address, address))

export const amInAddressList = (addressList, address) => addressList.find(a => addressesMatch(a, address))
