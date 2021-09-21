import { useQuery } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import _ from 'lodash'
import { POAP_USERS_SUBGRAPH_QUERY } from '../../graphql/queries'

const graphClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai'
  })
})

export function fetchAndSetPoapAddresses(setter, poapIds) {
  poapIds.forEach(poapId => {
    graphClient
      .query({
        query: POAP_USERS_SUBGRAPH_QUERY,
        variables: { eventId: poapId },
        skip: !poapId
      })
      .then(({ data }) => {
        const event = data && data.event
        setter(prevState => {
          let addresses = { ...prevState }
          event &&
            event.tokens.forEach(t => {
              const obj = {}
              obj[poapId] = t.id
              const newObj = { ...prevState[t.owner.id], ...obj }
              const newState = {}
              newState[t.owner.id] = newObj
              addresses = { ...addresses, ...newState }
            })
          return addresses
        })
      })
  })
}
