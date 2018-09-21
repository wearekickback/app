import getWeb3 from '../web3'

export const defaults = {}

const resolvers = {
  Query: {
    getReverseRecord: async (_, { address }) => {
      const obj = {
        address,
        __typename: 'ReverseRecord'
      }

      try {
        const web3 = getWeb3()
        const resolver = await web3.eth.resolver(address.slice(0, 2))
        console.log(resolver)
        return {
          ...obj,
          name: 'hardcoded.eth'
        }
      } catch (e) {
        return {
          ...obj,
          name: null
        }
      }
    }
  }
}

export default resolvers
