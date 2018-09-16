import merge from 'lodash/merge'
import eventsList from '../fixtures/events.json'
import getEthers, { signer } from './ethers'
import singleEventResolvers, {
  defaults as singleEventDefaults
} from './resolvers/singleEventResolvers'
import ensResolvers, { defaults as ensDefaults } from './resolvers/ensResolvers'

const rootDefaults = {
  ethers: {
    accounts: [],
    networkId: 0,
    __typename: 'Web3'
  }
}

const resolvers = {
  Query: {
    async ethers() {
      return {
        ...getEthers(),
        __typename: 'Ethers'
      }
    },
    async parties() {
      return eventsList.map(event => ({ ...event, __typename: 'PartyMeta' }))
    }
  },

  Mutation: {
    async signMessage(message) {
      const signature = await signer.signMessage(message)
      return signature
    },
    async verifyMessage(message, signature) {
      const ethers = getEthers()
      return ethers.Wallet.verifyMessage(message, signature)
    }
  }
}

const defaults = merge(rootDefaults, singleEventDefaults, ensDefaults)

export default merge(resolvers, singleEventResolvers, ensResolvers)

export { defaults }
