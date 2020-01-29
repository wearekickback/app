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
import ModalProvider, { ModalContext } from './contexts/ModalContext'
import { GlobalProvider } from './GlobalState'
import './globalStyles'

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
      <ModalProvider>
        <ModalContext.Consumer>
          {context => (
            <GlobalProvider modalContext={context}>
              <App />
            </GlobalProvider>
          )}
        </ModalContext.Consumer>
      </ModalProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )
})
