import EthVal from 'ethval'
import { Decimal } from 'decimal.js'
import { isBN } from 'web3-utils'

export const parseEthValue = v => new EthVal(v)
