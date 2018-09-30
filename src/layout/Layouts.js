import React, { Fragment } from 'react'
import styled from 'react-emotion'

import Header from './Header'
import Footer from './Footer'
import ErrorBox from '../components/ErrorBox'
import { getNetworkError } from '../api/web3'

const Container = styled('main')`
  background: white;
  margin-left: 40px;
  margin-right: 40px;
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
