import React from 'react'

import { TOKEN_QUERY } from 'graphql/queries'
import SafeQuery from '../SafeQuery'
import { depositValue } from '../Utils/DepositValue'

const Currency = ({ amount, tokenAddress, precision = 2 }) => {
  return (
    <SafeQuery
      query={TOKEN_QUERY}
      variables={{ tokenAddress }}
      renderError={err => {
        return 'Token not found'
      }}
    >
      {({
        data: {
          token: { symbol, decimals }
        },
        loading
      }) => {
        return (
          <>
            {amount !== undefined &&
              depositValue(amount, decimals, Math.min(precision, decimals))}
            &nbsp;
            {symbol}
          </>
        )
      }}
    </SafeQuery>
  )
}
export default Currency
