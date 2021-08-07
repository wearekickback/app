import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'

import { RouteAnalytics } from './components/Analytics'

import DefaultLayout, {
  HomePageLayout,
  NoWeb3CheckLayout
} from './layout/Layouts'

import AllEvents from './routes/AllEvents'
import Bridge from './routes/Bridge'
import CreateEvent from './routes/CreateEvent'
import SingleEvent from './routes/SingleEvent'
import SingleEventChallenge from './routes/SingleEventChallenge'
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

class App extends Component {
  render() {
    return (
      <Fragment>
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
              <Route exact path="/bridge" component={Bridge} />
              <Route exact path="/event/:address" component={SingleEvent} />
              <Route
                path="/event/:address/admin"
                component={SingleEventAdmin}
              />
              <Route
                path="/event/:address/challenge"
                component={SingleEventChallenge}
              />
              <Route
                path="/user/:username"
                component={UserProfile}
                layout={NoWeb3CheckLayout}
              />
              <Route path="/create" component={CreateEvent} />
              <Route path="/faq" component={Faq} layout={NoWeb3CheckLayout} />
              <Route
                path="/terms"
                component={Terms}
                layout={NoWeb3CheckLayout}
              />
              <Route
                path="/privacy"
                component={Privacy}
                layout={NoWeb3CheckLayout}
              />
              <Route
                path="/pricing"
                component={Pricing}
                layout={NoWeb3CheckLayout}
              />
              <Route path="/team" component={Team} layout={NoWeb3CheckLayout} />
              <Route
                path="/gettingstarted"
                component={GettingStarted}
                layout={NoWeb3CheckLayout}
              />
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
