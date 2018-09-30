import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import graphqlClient from './graphql'
import setupWeb3 from './api/web3'
import { GlobalProvider } from './GlobalState'
import './globalStyles'


window.addEventListener('load', async () => {
  setupWeb3()
  ReactDOM.render(
    <ApolloProvider client={graphqlClient}>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )
})

registerServiceWorker()
