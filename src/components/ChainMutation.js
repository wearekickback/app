import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { events, getTransactionReceipt } from '../api/web3'
import SafeMutation from './SafeMutation'
import { NEW_BLOCK } from '../constants/events'
import { NUM_CONFIRMATIONS } from '../constants/ethereum'

export default class ChainMutation extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  state = {}

  componentDidMount () {
    events.on(NEW_BLOCK, this._onNewBlock)
  }

  componentWillUnmount () {
    events.off(NEW_BLOCK, this._onNewBlock)
  }

  _onNewBlock = async block => {
    const { tx } = this.state

    if (tx) {
      // confirmations
      const numConfirmations = block.number - tx.blockNumber
      const percentComplete = parseInt((numConfirmations / NUM_CONFIRMATIONS) * 100.0)
      const inProgress = numConfirmations < NUM_CONFIRMATIONS

      // check result
      let succeeded = false
      let failed = false
      if (!inProgress) {
        const real = await getTransactionReceipt(tx.transactionHash)
        failed = !_.get(real, 'status')
        succeeded = !failed
      }

      this.setState({
        numConfirmations,
        percentComplete,
        inProgress,
        succeeded,
        failed,
      })
    }
  }

  _onCompleted = result => {
    const { resultKey } = this.props

    const tx = result[resultKey]

    if (tx) {
      this.setState({
        tx,
        percentComplete: 0,
        inProgress: true,
      })
    }
  }

  render () {
    const {
      mutation,
      variables,
      children,
      resultKey,
      ...otherProps
    } = this.props

    return (
       <SafeMutation
         mutation={mutation}
         variables={variables}
         {...otherProps}
         onCompleted={this._onCompleted}
        >
        {(mutator, result) => {
          return children(mutator, {
            tx: _.get(result, resultKey),
            ...this.state
          })
        }}
      </SafeMutation>
    )
  }
}
