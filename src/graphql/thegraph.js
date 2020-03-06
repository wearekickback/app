import { HttpLink } from 'apollo-link-http'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

const cache = new InMemoryCache()
const THE_GRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/wearekickback/kickback'

export const clientInstance = new ApolloClient({
  cache,
  link: new HttpLink({ uri: THE_GRAPH_URL })
})

export default clientInstance
