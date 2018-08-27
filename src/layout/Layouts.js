import React, { Fragment } from 'react'
import Header from './Header'

const DefaultLayout = ({ children }) => (
  <Fragment>
    <Header />
    {children}
  </Fragment>
)

export const HomePageLayout = ({ children }) => <Fragment>{children}</Fragment>

export default DefaultLayout
