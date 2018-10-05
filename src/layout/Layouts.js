import React, { Fragment } from 'react'
import styled from 'react-emotion'

import Header from './Header'
import Footer from './Footer'
import ErrorBox from '../components/ErrorBox'
import { getNetworkError } from '../api/web3'

const Container = styled('main')`
  background: white;
  padding: 0 20px;
  max-width: 100%;
`

const DefaultLayout = ({ children }) => (
  <Fragment>
    <Header />
    {getNetworkError() ? <ErrorBox>{`${getNetworkError}`}</ErrorBox> : null}
    <Container>{children}</Container>
    <Footer />
  </Fragment>
)

export const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

export default DefaultLayout
