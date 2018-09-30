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
          this.props.children({
            address: this.props.address,
            name: null
          })
        )}
      >
        {({ reverseRecord = {} }) => {
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
