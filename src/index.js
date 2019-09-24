import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import { setup as setupLogRocket } from './api/logRocket'
import { setup as setupRollbar } from './api/rollbar'
import { setup as setupAnalytics } from './api/analytics'
import './index.css'
import App from './App'
import { clientInstance } from './graphql'
import setupWeb3 from './api/web3'
import { GlobalProvider } from './GlobalState'
import './globalStyles'
import { universalLoginSdk } from './universal-login'

universalLoginSdk.start()

window.addEventListener('load', async () => {
  setupRollbar()
  setupLogRocket()
  setupAnalytics()

  setupWeb3().catch(_ => {})

  ReactDOM.render(
    <ApolloProvider client={clientInstance}>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )
})
