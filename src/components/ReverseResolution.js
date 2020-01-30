import React from 'react'

import SafeQuery from './SafeQuery'
import { ReverseRecordQuery } from '../graphql/queries'

const ReverseResolution = ({ address }) => {
  return (
    <SafeQuery
      query={ReverseRecordQuery}
      variables={{ address }}
      renderLoading={() => <span>{address}</span>}
    >
      {({ data: { reverseRecord = {} } }) => {
        if (!reverseRecord.name) {
          return <span>{address}</span>
        }
        return <span>{reverseRecord.name}</span>
      }}
    </SafeQuery>
  )
}

export default ReverseResolution
