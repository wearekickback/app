import merge from 'lodash/merge'
import getEthers, { provider } from './ethers'
import { abi } from './abi.json'

const rootDefaults = {
  ethers: {
    accounts: [],
    networkId: 0,
    __typename: 'Web3'
  }
}

const resolvers = {
  // Ethers: () => {
  //   return getEthers()
  // },
  Party: {
    async attendees({ contract, address }, _, context) {
      const attendees = await contract.registered()
      return attendees.toString()
    }
  },
  Query: {
    ethers: async (_, variables, context) => {
      return {
        ...getEthers(),
        __typename: 'Ethers'
      }
    },
    async party(_, { address }, context) {
      const Ethers = getEthers()
      const contract = new Ethers.Contract(address, abi, provider)
      return {
        address,
        contract,
        __typename: 'Party'
      }
    }
  },

  Mutation: {}
}

const defaults = merge(rootDefaults)

export default merge(resolvers)

export { defaults }
