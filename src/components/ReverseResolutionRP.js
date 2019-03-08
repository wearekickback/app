import React, { Component } from 'react'

import SafeQuery from './SafeQuery'
import { REVERSE_RECORD_QUERY } from '../graphql/queries'

class ReverseResolution extends Component {
  render() {
    return (
      <SafeQuery
        query={REVERSE_RECORD_QUERY}
        variables={{ address: this.props.address }}
        renderLoading={() =>
          this.props.children({
            address: this.props.address,
            name: null
          })
        }
      >
        {({ data: { reverseRecord = {} } }) => {
          if (!reverseRecord.name) {
            return this.props.children({
              address: this.props.address,
              name: null
            })
          }

          return this.props.children({
            address: this.props.address,
            name: reverseRecord.name
          })
        }}
      </SafeQuery>
    )
  }
}

export default ReverseResolution
