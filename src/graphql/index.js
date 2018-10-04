import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import createLinks from './links/index'

const cache = new InMemoryCache(window.__APOLLO_STATE__)

export const clientInstance = new ApolloClient({
  cache,
  link: createLinks({ cache })
})
