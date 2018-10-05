import { toBN } from 'web3-utils'

export function winningShare(deposit, registered, attended) {
  return ((deposit * registered) / attended).toFixed(3)
}

export class EthValue {
  constructor (src, unit) {
    this._bn = toBN(src)
    this._unit = unit

    ;['mul', 'sub', 'div', 'add'].forEach(method => {
      this[method] = v => {
        this._bn = this._bn[method].call(this._bn, v)
        return this
      }
    })
  }

  get isWei () {
    return 'wei' === this._unit
  }

  get isGwei () {
    return 'gwei' === this._unit
  }

  get isEth () {
    return 'eth' === this._unit
  }

  scaleDown (v) {
    return this.mul(toBN(10).pow(v))
  }

  scaleUp (v) {
    return this.div(toBN(10).pow(v))
  }

  toWei () {
    if (this.isWei) return this
    if (this.isGwei) return this.scaleDown(3)
    if (this.isEth) return this.scaleDown(18)

    throw new Error('Unit of measurement uncertain')
  }

  toGwei () {
    if (this.isWei) return this.scaleUp(3)
    if (this.isGwei) return this
    if (this.isEth) return this.scaleDown(15)

    throw new Error('Unit of measurement uncertain')
  }

  toEth () {
    if (this.isWei) return this.scaleUp(18)
    if (this.isGwei) return this.scaleUp(15)
    if (this.isEth) return this

    throw new Error('Unit of measurement uncertain')
  }

  toFixed (v) {
    const str = this._bn.toString(10)
    const dotPos = str.indexOf('.')
    if (0 <= dotPos) {
      return str.substr(0, dotPos + v + 1)
    } else {
      return `${str}.`.padEnd(str.length + 1 + v, '0')
    }
  }
}

export const parseEthValue = v => new EthValue(v)
