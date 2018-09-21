import React, { Fragment } from 'react'

import Header from './Header'
import Footer from './Footer'
import ErrorBox from '../components/ErrorBox'
import { getNetworkError } from '../api/web3'

const DefaultLayout = ({ children }) => (
  <Fragment>
    <Header />

    {getNetworkError() ? <ErrorBox>{`${getNetworkError}`}</ErrorBox> : null}
    {children}
    <Footer />
  </Fragment>
)

export const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

export default DefaultLayout
