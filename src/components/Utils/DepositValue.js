import React from 'react'
import { toEthVal } from '../../utils/units'

const DepositValue = ({ className, value, prefix }) => (
  <span className={className}>{`${prefix || ''}${toEthVal(value)
    .toEth()
    .toFixed(2)} ETH`}</span>
)

export default DepositValue
