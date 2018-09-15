import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import DefaultLayout from './layout/Layouts'
//import { HomePageLayout } from './layout/Layouts'

import Home from './routes/Home'
import SingleEvent from './routes/SingleEvent'
import Modal from './components/Modal/Modal'

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
            <Route path="/party/:address" component={SingleEvent} />
          </Switch>
        </Router>
        <Modal name="signIn">Sign in</Modal>
      </Fragment>
    )
  }
}

export default App
