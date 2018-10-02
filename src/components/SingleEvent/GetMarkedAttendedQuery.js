import React, { Component } from 'react'
import SafeQuery from '../SafeQuery'
import { GET_MARKED_ATTENDED_SINGLE } from '../../graphql/queries'

class GetMarkedAttendeesQuery extends Component {
  render() {
    return (
      <SafeQuery
        query={GET_MARKED_ATTENDED_SINGLE}
        variables={this.props.variables}
      >
        {({ markAttendedSingle }) => this.props.children(markAttendedSingle)}
      </SafeQuery>
    )
  }
}

export default GetMarkedAttendeesQuery
