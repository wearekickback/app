import { events } from '@wearekickback/contracts'
import { parseLog } from 'ethereum-event-logs'

export const extractNewPartyAddressFromTx = tx => {
  // coerce events into logs if available
  if (tx.events) {
    tx.logs = Object.values(tx.events).map(a => {
      a.topics = a.raw.topics
      a.data = a.raw.data
      return a
    })
  }
  const [event] = parseLog(tx.logs || [], [events.NewParty])
  return event ? event.args.deployedAddress : null
}

export function txHelper(web3TxObj) {
  return new Promise(resolve => {
    web3TxObj.on('transactionHash', hash => {
      resolve(hash)
    })
  })
}

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

export const isEmptyAddress = address => {
  return !address || address === EMPTY_ADDRESS
}
