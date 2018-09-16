import { provider } from '../ethers'

export const defaults = {}

const resolvers = {
  Query: {
    getReverseRecord: async (_, { address }) => {
      const obj = {
        address,
        __typename: 'ReverseRecord'
      }

      console.log('here')

      try {
        const name = await provider.lookupAddress(address)
        console.log(name)
        return {
          ...obj,
          name
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
