import { getWeb3Read } from '../web3'
import POAP_ABI from '../abi/poap'
export const defaults = {}

const POAP_MAINNET_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415'

// Event IDs aren't indexed so we define
// a starting block in order to cut load times
const START_BLOCK = 9000000

const resolvers = {
  Query: {
    getAttendees: async (_, { eventId }) => {
      const web3 = await getWeb3Read()
      const poap = new web3.eth.Contract(POAP_ABI, POAP_MAINNET_ADDRESS)

      return poap
        .getPastEvents('EventToken', {
          fromBlock: START_BLOCK,
          toBlock: 'latest'
        })
        .then(async function(events) {
          const tokenIds = events
            .filter(({ returnValues }) => returnValues.eventId === eventId) // Only get tokens from matching event
            .map(({ returnValues }) => returnValues.tokenId)
          const tokenOwners = (
            await Promise.all(
              tokenIds.map(async tokenId => {
                try {
                  const address = await poap.methods.ownerOf(tokenId).call()
                  return address
                } catch (err) {
                  // Some tokenIds return a VM execution error
                  return null
                }
              })
            )
          ).filter(address => address !== null)
          return tokenOwners
        })
    }
  }
}

export default resolvers
