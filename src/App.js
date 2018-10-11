import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import DefaultLayout from './layout/Layouts'
//import { HomePageLayout } from './layout/Layouts'

import Home from './routes/Home'
import CreatePendingEvent from './routes/CreatePendingEvent'
import DeployPendingEvent from './routes/DeployPendingEvent'
import SingleEvent from './routes/SingleEvent'
import Faq from './routes/Faq'
import SingleEventAdmin from './routes/SingleEventAdmin'
import Modal from './components/Modal/Modal'
import SignIn from './components/Auth/SignIn'
import { SIGN_IN } from './modals'

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
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  )
}

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/party/:address" component={SingleEvent} />
            <Route path="/party/:address/admin" component={SingleEventAdmin} />
            <Route path="/create" component={CreatePendingEvent} />
            <Route path="/deploy" component={DeployPendingEvent} />
            <Route path="/faq" component={Faq} />
          </Switch>
        </Router>
        <Modal name={SIGN_IN} component={SignIn} />
      </Fragment>
    )
  }
}

export default App
