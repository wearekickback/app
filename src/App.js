import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { RouteAnalytics } from './components/Analytics'

import DefaultLayout from './layout/Layouts'
import { HomePageLayout } from './layout/Layouts'

import AllEvents from './routes/AllEvents'
import CreateEvent from './routes/CreateEvent'
import SingleEvent from './routes/SingleEvent'
import SingleEventAdmin from './routes/SingleEventAdmin'
import LandingPage from './routes/LandingPage'
import Team from './routes/Team'
import Faq from './routes/Faq'
import Privacy from './routes/Privacy'
import Pricing from './routes/Pricing'
import Terms from './routes/Terms'
import GettingStarted from './routes/GettingStarted'
import UserProfile from './routes/UserProfile'
import ScrollToTop from './components/ScrollToTop'
import Modal from './components/Modal/Modal'
import SignIn from './components/Auth/SignIn'
import EditProfile from './components/Profile/EditProfile'
import {
  SIGN_IN,
  EDIT_PROFILE,
  CONFIRM_TRANSACTION,
  ADD_TO_CALENDAR
} from './modals'

import { TWITTER_HANDLE } from 'config'
import './App.css'

const Route = ({
  component: Component,
  layout: Layout = DefaultLayout,
  ...rest
}) => {
  return (
    <DefaultRoute
      {...rest}
      render={props => (
        <RouteAnalytics key={rest.path}>
          <Layout>
            <Component {...props} />
          </Layout>
        </RouteAnalytics>
      )}
    />
  )
}

const siteTitle = 'Kickback'
const siteDesc =
  'Event no shows? No problem. Kickback reduces no shows by asking registrants to put some skin in the game.'
const baseUrl = window.location.protocol + '//' + window.location.host
const siteImageSrc = `${baseUrl}/card.png`

class App extends Component {
  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{siteTitle}</title>
          <meta property="description" content={siteDesc} />
          <meta property="og:title" content={siteTitle} />
          <meta property="og:description" content={siteDesc} />
          <meta property="og:image" content={siteImageSrc} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />
          <meta property="twitter:title" content={siteTitle} />
          <meta property="twitter:description" content={siteDesc} />
          <meta property="twitter:image" content={siteImageSrc} />
          <meta property="twitter:site" content={TWITTER_HANDLE} />
          <meta property="twitter:card" content="summary" />
        </Helmet>
        <Router>
          <ScrollToTop>
            <Switch>
              <Route
                exact
                path="/"
                component={LandingPage}
                layout={HomePageLayout}
              />
              <Route exact path="/events" component={AllEvents} />
              <Route exact path="/event/:address" component={SingleEvent} />
              <Route
                path="/event/:address/admin"
                component={SingleEventAdmin}
              />
              <Route path="/user/:username" component={UserProfile} />
              <Route path="/create" component={CreateEvent} />
              <Route path="/faq" component={Faq} />
              <Route path="/terms" component={Terms} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/team" component={Team} />
              <Route path="/gettingstarted" component={GettingStarted} />
            </Switch>
            <Modal name={SIGN_IN} component={SignIn} />
            <Modal name={EDIT_PROFILE} component={EditProfile} />
            <Modal small name={CONFIRM_TRANSACTION} />
            <Modal small name={ADD_TO_CALENDAR} />
          </ScrollToTop>
        </Router>
      </Fragment>
    )
  }
}

export default App
