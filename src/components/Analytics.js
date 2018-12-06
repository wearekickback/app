import { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { track } from '../api/analytics'

class RouteAnalyticsWrapper extends Component {
  componentDidMount() {
    track(`Route ${this.props.history.location.pathname}`)
  }

  render() {
    return this.props.children
  }
}

export const RouteAnalytics = withRouter(RouteAnalyticsWrapper)
