import React, { Fragment } from 'react'
import Header from './Header'
import Footer from './Footer'

const DefaultLayout = ({ children }) => (
  <Fragment>
    <Header />
    {children}
    <Footer />
  </Fragment>
)

export const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

export default DefaultLayout
