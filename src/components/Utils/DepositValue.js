import React from 'react'
import { toEthVal } from '../../utils/units'

const DepositValue = ({ className, value, prefix, decimals = 18 }) => (
  <span className={className}>{`${prefix || ''}${toEthVal(value)
    .scaleUp(decimals)
    .toFixed(2)}`}</span>
)

export function depositValue(value, decimals = 18, precision = 2) {
  return toEthVal(value)
    .scaleUp(decimals)
    .toFixed(precision)
}

export default DepositValue
