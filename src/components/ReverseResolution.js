import React, { Component } from 'react'
import gql from 'graphql-tag'

import Query from './Query'

const GET_REVERSE_RECORD = gql`
  query getReverseRecord($address: String) @client {
    getReverseRecord(address: $address) {
      name
      address
    }
  }
`

class ReverseResolution extends Component {
  render() {
    return (
      <Query
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
      </Query>
    )
  }
}

export default ReverseResolution
