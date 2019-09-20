import React from 'react'

import { TOKEN_QUERY } from '../../graphql/queries'
import SafeQuery from '../SafeQuery'

const Currency = ({ tokenAddress, deposit }) => {
  return (
    <SafeQuery query={TOKEN_QUERY} variables={{ tokenAddress }}>
      {({
        data: {
          token: { symbol }
        },
        loading
      }) => {
        return (
          <>
            {deposit} {symbol}
          </>
        )
      }}
    </SafeQuery>
  )
}
export default Currency
