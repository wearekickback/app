import { Decimal } from 'decimal.js'
import { isBN } from 'web3-utils'

const toDecimal = v => (isBN(v) ? new Decimal(v.toString(10)) : new Decimal(v))

export class EthValue {
  constructor(src, unit = 'wei') {
    this._n = toDecimal(src)
    this._unit = unit
    ;['mul', 'sub', 'div', 'add'].forEach(method => {
      this[method] = v => {
        this._n = this._n[method].call(this._n, toDecimal(v))
        return this
      }
    })
  }

  get isWei() {
    return 'wei' === this._unit
  }

  get isGwei() {
    return 'gwei' === this._unit
  }

  get isEth() {
    return 'eth' === this._unit
  }

  scaleDown(v) {
    return this.mul(toDecimal(10).pow(toDecimal(v)))
  }

  scaleUp(v) {
    return this.div(toDecimal(10).pow(toDecimal(v)))
  }

  toWei() {
    if (this.isWei) return this
    if (this.isGwei) return this.scaleDown(3)
    if (this.isEth) return this.scaleDown(18)

    throw new Error('Unit of measurement uncertain')
  }

  toGwei() {
    if (this.isWei) return this.scaleUp(3)
    if (this.isGwei) return this
    if (this.isEth) return this.scaleDown(15)

    throw new Error('Unit of measurement uncertain')
  }

  toEth() {
    if (this.isWei) return this.scaleUp(18)
    if (this.isGwei) return this.scaleUp(15)
    if (this.isEth) return this

    throw new Error('Unit of measurement uncertain')
  }

  toString(v) {
    switch (v) {
      case 2:
        return this._n.toBinary()
      case 16:
        return this._n.toHexadecimal()
      default:
        return this._n.toString()
    }
  }

  toFixed(v) {
    return this._n.toFixed(v)
  }
}

export const parseEthValue = v => new EthValue(v)

export const winningShare = (deposit, numRegistered, numAttended) =>
  parseEthValue(deposit)
    .mul(numRegistered)
    .div(numAttended)
    .toEth()
    .toFixed(3)
