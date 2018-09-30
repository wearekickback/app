import React, { PureComponent } from 'react'
import gql from 'graphql-tag'

import SafeQuery from './SafeQuery'

const GET_REVERSE_RECORD = gql`
  query getReverseRecord($address: String) @client {
    getReverseRecord(address: $address) {
      name
      address
    }
  }
`

class ReverseResolution extends PureComponent {
  render() {
    return (
      <SafeQuery
        query={GET_REVERSE_RECORD}
        variables={{ address: this.props.address }}
        renderLoading={() => (
          <span>{this.props.address}</span>
        )}
      >
        {({ getReverseRecord }) => {
          if (!getReverseRecord.name) {
            return <span>{this.props.address}</span>
          }
          return <span>{getReverseRecord.name}</span>
        }}
      </SafeQuery>
    )
  }
}

export default ReverseResolution
