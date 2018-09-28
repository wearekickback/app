import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
const cache = new InMemoryCache(window.__APOLLO_STATE__)

const typeDefs = ``

const resolvers = {
  Query: {
    getReverseRecord: async (_, { address }) => {
      const obj = {
        address,
        __typename: 'ReverseRecord'
      }

      return {
        ...obj,
        name: 'vitalik.eth'
      }
    }
  }
}
const defaults = {}

const graphqlClient = new ApolloClient({
  cache,
  link: withClientState({
    resolvers,
    cache,
    defaults,
    typeDefs
  })
})

export default graphqlClient
