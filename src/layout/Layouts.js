import React, { Fragment } from 'react'
import styled from 'react-emotion'

import Header from './Header'
import Footer from './Footer'
import WarningBox from '../components/WarningBox'
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

const A = styled('a')`
  color: white;
  text-decoration: underline;
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
            wrongNetwork,
            readOnly
          }
        }) => {
          if (!resolved) {
            return null
          }

          let content

          if (wrongNetwork) {
            // content = `You are viewing events on ${expectedNetworkName} but your browser is connected to ${networkName}. Please switch to the correct network.`
          } else {
            if (readOnly || !networkId) {
              content = `Your browser is not connected to the Ethereum network, so you will not be able to sign in or interact with events.`
            }
          }

          return content ? (
            <WarningBox padding>
              {content}
              <br />
              Not sure what to do? Click <A href="/gettingstarted">here</A> to
              read "Getting started" guide
            </WarningBox>
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
