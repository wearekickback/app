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

export function lazyAsync(getter) {
  let promise
  let result

  return async () => {
    if (result) return result
    if (!promise) {
      promise = getter().then(res => {
        result = res
        return res
      })
    }
    return promise
  }
}

export const parseAvatar = url => {
  const ipfs = url.match(/^ipfs:\/\/(.*)/)
  if (ipfs) {
    const cid = ipfs[1]
    return `https://ipfs.io/ipfs/${cid}`
  } else {
    return url
  }
}
