import React, { PureComponent } from 'react'

import SafeQuery from './SafeQuery'
import { ReverseRecordQuery } from '../graphql/queries'

class ReverseResolution extends PureComponent {
  render() {
    return (
      <SafeQuery
        query={ReverseRecordQuery}
        variables={{ address: this.props.address }}
        renderLoading={() => (
          <span>{this.props.address}</span>
        )}
      >
        {({ reverseRecord = {} }) => {
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
