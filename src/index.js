import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'

import resolvers, { defaults } from './api/rootResolver'
import typeDefs from './api/schema'
import { ApolloProvider } from 'react-apollo'
import { setupEthers } from './api/ethers'
import { GlobalProvider } from './GlobalState'
import './globalStyles'

const cache = new InMemoryCache(window.__APOLLO_STATE__)

const graphqlClient = new ApolloClient({
  cache,
  link: withClientState({
    resolvers,
    cache,
    defaults,
    typeDefs
  })
})

window.addEventListener('load', async () => {
  await setupEthers()
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
