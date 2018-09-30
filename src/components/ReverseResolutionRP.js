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
      </SafeQuery>
    )
  }
}

export default ReverseResolution
