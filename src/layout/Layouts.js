import React, { Fragment } from 'react'

import Header from './Header'
import Footer from './Footer'
import ErrorBox from '../components/ErrorBox'
import { getNetworkError } from '../api/ethers'

const DefaultLayout = ({ children }) => (
  <Fragment>
    <Header />

    {getNetworkError ? <ErrorBox>{`${networkError}`}</ErrorBox> : null}
    {children}
    <Footer />
  </Fragment>
)

export const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

export default DefaultLayout
