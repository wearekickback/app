import ethVal from 'ethval'
import React from 'react'

const DepositValue = ({ value }) => {
  const depositValue = new ethVal(value).toEth().toFixed(2)
  return <>{depositValue}</>
}

export default DepositValue
