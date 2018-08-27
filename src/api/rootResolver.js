import merge from 'lodash/merge'
import getEthers from './ethers'

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
  Query: {
    ethers: async (_, variables, context) => {
      console.log('hello')
      console.log(getEthers())
      return getEthers()
    },
    attendees() {}
  },

  Mutation: {}
}

const defaults = merge(rootDefaults)

export default merge(resolvers)

export { defaults }
