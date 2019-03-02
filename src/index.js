import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import * as LogRocket from './logRocket'
import { setup as setupAnalytics } from './api/analytics'
import './index.css'
import App from './App'
import { clientInstance } from './graphql'
import setupWeb3 from './api/web3'
import { GlobalProvider } from './GlobalState'
import './globalStyles'

LogRocket.init()

window.addEventListener('load', async () => {
  setupAnalytics()

  setupWeb3().catch(_ => {})

  const rootElement = document.getElementById('root')
  let render
  if (rootElement.hasChildNodes()) {
    render = ReactDOM.hydrate
  } else {
    render = ReactDOM.render
  }

  render(
    <ApolloProvider client={clientInstance}>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </ApolloProvider>,
    rootElement
  )
})
