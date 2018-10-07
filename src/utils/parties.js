import { toBN } from 'web3-utils'

import { addressesMatch } from './strings'
import { PARTICIPANT_STATUS } from './status'

export const amParticipant = (participants, address) => participants.find(a => addressesMatch(a.user.address, address))

export const amInAddressList = (addressList, address) => addressList.find(a => addressesMatch(a, address))

export const calculateFinalizeMaps = participants => {
  // sort participants array
  participants.sort((a, b) => a.index < b.index ? -1 : 1)

  const maps = []
  let currentMap
  for (let i = 0; participants.length > i; i += 1) {
    if (0 === i % 256) {
      currentMap = toBN(0)
      maps.push(currentMap)
    }

    if (participants[i].status === PARTICIPANT_STATUS.SHOWED_UP) {
      currentMap = currentMap.bincn(i)
    }
  }

  return maps.map(m => m.toString(16))
}
