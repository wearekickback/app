import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { withClientState } from "apollo-link-state"
const cache = new InMemoryCache(window.__APOLLO_STATE__)
const merge = require("lodash/merge")

const typeDefs = ``

const defaultResolvers = {
  Query: {
    getReverseRecord: (_, { address }) => {
      const obj = {
        address,
        __typename: "ReverseRecord"
      }

      return {
        ...obj,
        name: "vitalik.eth"
      }
    }
  }
}
const defaults = {}

export default function createClient(resolvers = {}) {
  const merged = merge({ ...defaultResolvers }, resolvers)
  console.log(merged)
  return new ApolloClient({
    cache,
    link: withClientState({
      resolvers: merge({ ...defaultResolvers }, resolvers),
      defaults,
      typeDefs
    })
  })
}
