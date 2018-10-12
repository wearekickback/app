import React, { Fragment } from 'react'
import styled from 'react-emotion'

import Header from './Header'
import Footer from './Footer'
import ErrorBox from '../components/ErrorBox'
import { getNetworkError } from '../api/web3'

const Container = styled('main')`
  background: white;
  padding: 0 20px 60px;
`

const ContainerInner = styled('div')`
  max-width: 1200px;
  margin: 0 auto 0;
`

const DefaultLayout = ({ children }) => {
  const networkError = getNetworkError()

  return (
    <Fragment>
      <Header />
      {networkError ? <ErrorBox>{`${networkError}`}</ErrorBox> : null}
      <Container>
        <ContainerInner>{children}</ContainerInner>
      </Container>
      <Footer />
    </Fragment>
  )
}

export const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

export default DefaultLayout
