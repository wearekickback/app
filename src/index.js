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
import { ENV, LOCKS } from './config'

// assumes mainnet or rinkeby Unlock for now
const networkId = ENV === 'live' ? 1 : 4
const locks = LOCKS[networkId]

window.unlockProtocolConfig = {
  locks,
  icon: 'https://kickback.events/card.png',
  callToAction: {
    default: 'Select a membership to access page.'
  }
}

window.addEventListener('load', async () => {
  setupRollbar()
  // only setup logrocket on dev/prod
  if (!window.location.href.includes('localhost')) {
    setupLogRocket()
  } else {
    console.log(window.location.href.includes('localhost'))
  }
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
