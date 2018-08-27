import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route as DefaultRoute,
  Switch
} from 'react-router-dom'
import DefaultLayout from './layout/Layouts'
import { HomePageLayout } from './layout/Layouts'

import Home from './routes/Home'
import Party from './routes/Party'

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
      <Router>
        <Switch>
          <Route exact path="/" component={Home} layout={HomePageLayout} />
          <Route path="/name/:name" component={Party} />
        </Switch>
      </Router>
    )
  }
}

export default App
