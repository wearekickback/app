import React from 'react'
import { toEthVal } from '../../utils/units'

const DepositValue = ({ className, value, price, prefix }) => {
  const deposit = toEthVal(value)
    .toEth()
    .toFixed(2)

  return (
    <span className={className}>
      {`${prefix || ''}${deposit} ETH`} (${(deposit * price).toFixed(2)})
    </span>
  )
}

export default DepositValue
