import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import DefaultLayout from './layout/Layouts'
//import { HomePageLayout } from './layout/Layouts'

import Home from './routes/Home'
import Create from './routes/Create'
import SingleEvent from './routes/SingleEvent'
import SingleEventAdmin from './routes/SingleEventAdmin'
import Modal from './components/Modal/Modal'
import SignIn from './components/SignIn/SignIn'

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
            <Route path="/create" component={Create} />
          </Switch>
        </Router>
        <Modal name="signIn" component={SignIn} />
      </Fragment>
    )
  }
}

export default App
