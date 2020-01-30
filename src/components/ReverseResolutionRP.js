import React from 'react'

import SafeQuery from './SafeQuery'
import { REVERSE_RECORD_QUERY } from '../graphql/queries'

const ReverseResolution = ({ children, address }) => {
  return (
    <SafeQuery
      query={REVERSE_RECORD_QUERY}
      variables={{ address }}
      renderLoading={() =>
        children({
          address,
          name: null
        })
      }
    >
      {({ data: { reverseRecord = {} } }) => {
        if (!reverseRecord.name) {
          return children({
            address,
            name: null
          })
        }

        return children({
          address,
          name: reverseRecord.name
        })
      }}
    </SafeQuery>
  )
}

export default ReverseResolution
