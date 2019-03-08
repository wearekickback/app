import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'

import { RouteAnalytics } from './components/Analytics'

import DefaultLayout from './layout/Layouts'
import { HomePageLayout } from './layout/Layouts'

import AllEvents from './routes/AllEvents'
import CreatePendingEvent from './routes/CreatePendingEvent'
import DeployPendingEvent from './routes/DeployPendingEvent'
import SingleEvent from './routes/SingleEvent'
import SingleEventAdmin from './routes/SingleEventAdmin'
import LandingPage from './routes/LandingPage'
import Team from './routes/Team'
import Faq from './routes/Faq'
import Privacy from './routes/Privacy'
import Pricing from './routes/Pricing'
import Terms from './routes/Terms'
import GettingStarted from './routes/GettingStarted'
import ScrollToTop from './components/ScrollToTop'
import Modal from './components/Modal/Modal'
import SignIn from './components/Auth/SignIn'
import EditProfile from './components/Profile/EditProfile'
import { SIGN_IN, EDIT_PROFILE, CONFIRM_TRANSACTION } from './modals'

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
              <Route exact path="/event/:address" component={SingleEvent} />
              <Route
                path="/event/:address/admin"
                component={SingleEventAdmin}
              />
              <Route path="/create" component={CreatePendingEvent} />
              <Route path="/deploy" component={DeployPendingEvent} />
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
          </ScrollToTop>
        </Router>
      </Fragment>
    )
  }
}

export default App
