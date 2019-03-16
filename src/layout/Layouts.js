import React, { Fragment } from 'react'
import styled from 'react-emotion'

import Header from './Header'
import Footer from './Footer'
import ErrorBox from '../components/ErrorBox'
import { GlobalConsumer } from '../GlobalState'

const Container = styled('main')`
  background: white;
  padding: 0 0 60px;
`

export const ContainerInner = styled('div')`
  max-width: 1200px;
  margin: 0 auto 0;
  padding: 0 20px 0;
`

const DefaultLayout = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <GlobalConsumer>
        {({
          networkState: {
            resolved,
            networkId,
            networkName,
            expectedNetworkName,
            expectedNetworkId,
            wrongNetwork,
            readOnly
          }
        }) => {
          if (!resolved) {
            return null
          }

          let content

          if (wrongNetwork) {
            content = `You are viewing events on ${expectedNetworkName} (${expectedNetworkId}) but your browser is connected to ${networkName} (${networkId}).`
          } else {
            if (readOnly || !networkId) {
              content = `Your browser is not connected to the Ethereum network, so you will not be able to sign in or interact with events.`
            }
          }

          return content ? (
            <ErrorBox>
              {content} .
              <br />
              Not sure what to do? Click <a href="/gettingstarted">here</a> to
              read "Getting started" guide
            </ErrorBox>
          ) : null
        }}
      </GlobalConsumer>
      <Container>
        <ContainerInner>{children}</ContainerInner>
      </Container>
      <Footer />
    </Fragment>
  )
}

export const HomePageLayout = ({ children }) => (
  <Fragment>
    {children}
    <Footer />
  </Fragment>
)

export default DefaultLayout
