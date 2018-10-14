import React, { Fragment } from 'react'
import styled from 'react-emotion'

import Header from './Header'
import Footer from './Footer'
import ErrorBox from '../components/ErrorBox'
import { GlobalConsumer } from '../GlobalState'

const Container = styled('main')`
  background: white;
  padding: 0 20px 60px;
`

export const ContainerInner = styled('div')`
  max-width: 1200px;
  margin: 0 auto 0;
`

const DefaultLayout = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <GlobalConsumer>
        {({ networkState: { networkId, shouldBeOnNetwork, readOnly } }) => {
          let content

          if (shouldBeOnNetwork && networkId) {
            content = `You are viewing events on ${shouldBeOnNetwork} but your browser is connected to a different Ethereum network.`
          } else {
            if (readOnly || !networkId) {
              content = `Your browser is not connected to the Ethereum network, so you will not be able to sign in or interact with events.`
            }
          }

          return content ? <ErrorBox>{content}</ErrorBox> : null
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
