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

const ContainerInner = styled('div')`
  max-width: 1200px;
  margin: 0 auto 0;
`

const DefaultLayout = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <GlobalConsumer>
        {({ networkState: { networkError } }) => (
          networkError ? <ErrorBox>{`${networkError}`}</ErrorBox> : null
        )}
      </GlobalConsumer>
      <Container>
        <ContainerInner>{children}</ContainerInner>
      </Container>
      <Footer />
    </Fragment>
  )
}

export const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

export default DefaultLayout
