import React from 'react'

import { TOKEN_QUERY } from '../../graphql/queries'
import SafeQuery from '../SafeQuery'
import { depositValue } from '../Utils/DepositValue'
import Loader from '../../components/Loader'

const Currency = ({ amount, tokenAddress, precision = 2 }) => {
  return (
    <SafeQuery
      query={TOKEN_QUERY}
      variables={{ address: tokenAddress }}
      renderError={err => {
        return 'Token not found'
      }}
    >
      {({ data, loading, error }) => {
        if (error) return <div>Error getting token</div>
        if (!data) return <div>Error getting token, no data found</div>
        if (loading) return <Loader />
        const {
          token: { symbol, decimals }
        } = data
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
