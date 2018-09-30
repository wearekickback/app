import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import createLinks from './links/index'

const cache = new InMemoryCache(window.__APOLLO_STATE__)

export default new ApolloClient({
  cache,
  link: createLinks({ cache })
})
