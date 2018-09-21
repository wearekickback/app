import React, { Fragment } from 'react'
import styled from 'react-emotion'
import Header from './Header'
import Footer from './Footer'

import { getNetworkError } from '../api/web3'

const Warning = styled('div')`
  width: 100%;
  background: #f00;
  color: #fff;
  padding: 1em 2em;
  justify-content: space-between;
`

const DefaultLayout = ({ children }) => (
  <Fragment>
    <Header />
    {getNetworkError() ? <Warning>{`${networkError}`}</Warning> : null}
    {children}
    <Footer />
  </Fragment>
)

export const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

export default DefaultLayout
