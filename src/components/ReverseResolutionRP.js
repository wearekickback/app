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
          this.props.children({
            address: this.props.address,
            name: null
          })
        )}
      >
        {({ getReverseRecord }) => {
          if (!getReverseRecord.name) {
            return this.props.children({
              address: this.props.address,
              name: null
            })
          }

          return this.props.children({
            address: this.props.address,
            name: getReverseRecord.name
          })
        }}
      </Query>
    )
  }
}

export default ReverseResolution
