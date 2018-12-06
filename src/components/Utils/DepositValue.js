import { toEthVal } from '../../utils/units'

const DepositValue = ({ value }) =>
  toEthVal(value)
    .toEth()
    .toFixed(2)

export default DepositValue
