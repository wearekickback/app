import React, { Component } from 'react'

import SafeQuery from './SafeQuery'
import { ReverseRecordQuery } from '../graphql/queries'

class ReverseResolution extends Component {
  render() {
    return (
      <SafeQuery
        query={ReverseRecordQuery}
        variables={{ address: this.props.address }}
        renderLoading={() => <span>{this.props.address}</span>}
      >
        {({ data: { reverseRecord = {} } }) => {
          if (!reverseRecord.name) {
            return <span>{this.props.address}</span>
          }
          return <span>{reverseRecord.name}</span>
        }}
      </SafeQuery>
    )
  }
}

export default ReverseResolution
