import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { HttpLink } from 'apollo-link-http'

import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { API_URL } from './config'
import resolvers, { defaults } from './api/rootResolver'
import typeDefs from './api/schema'
import { ApolloProvider } from 'react-apollo'
import { ApolloLink } from 'apollo-link'
import { setupWeb3 } from './api/web3'
import { GlobalProvider } from './GlobalState'
import './globalStyles'

const cache = new InMemoryCache(window.__APOLLO_STATE__)

const graphqlClient = new ApolloClient({
  cache,
  link: ApolloLink.from([
    withClientState({
      resolvers,
      cache,
      defaults,
      typeDefs
    }),
    new HttpLink({ uri: `${API_URL}/graphql` })
  ])
})

window.addEventListener('load', async () => {
  await setupWeb3()
  ReactDOM.render(
    <GlobalProvider>
      <ApolloProvider client={graphqlClient}>
        <App />
      </ApolloProvider>
    </GlobalProvider>,
    document.getElementById('root')
  )
})

registerServiceWorker()
