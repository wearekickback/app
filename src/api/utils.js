import { events } from '@noblocknoparty/contracts'
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
