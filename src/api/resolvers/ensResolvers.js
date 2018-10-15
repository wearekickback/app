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
        const web3 = await getWeb3()
        const resolver = await web3.eth.ens.resolver(
          `${address.slice(0, 2)}.addr.reverse`
        )
        const name = resolver.methods.name().call()

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
