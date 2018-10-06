import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { events, getTransactionReceipt } from '../api/web3'
import SafeMutation from './SafeMutation'
import SafeQuery from './SafeQuery'
import ErrorBox from './ErrorBox'
import { NEW_BLOCK } from '../utils/events'
import { NUM_CONFIRMATIONS } from '../config'

export default class ChainMutation extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    resultKey: PropTypes.string.isRequired,
  }

  state = {}

  componentDidMount () {
    events.on(NEW_BLOCK, this._onNewBlock)
  }

  componentWillUnmount() {
    events.off(NEW_BLOCK, this._onNewBlock)
  }

  _onNewBlock = async block => {
    const { tx, inProgress } = this.state

    if (tx && inProgress) {
      // confirmations
      const numConfirmations = block.number - tx.blockNumber
      const percentComplete = parseInt(
        (numConfirmations / NUM_CONFIRMATIONS) * 100.0
      )
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
        failed
      })
    }
  }

  _onCompleted = result => {
    const { resultKey } = this.props

    if (result.error) {
      this.setState({
        failed: true,
        error: result.error,
      })

      return
    }

    const tx = result[resultKey]

    if (tx) {
      this.setState({
        tx,
        percentComplete: NUM_CONFIRMATIONS > 0 ? 0 : 100,
        inProgress: NUM_CONFIRMATIONS > 0 ? true : false,
        succeeded: NUM_CONFIRMATIONS > 0 ? false : true,
        failed: false,
      })
    }
  }

  _renderWithSuccessQuery = content => {
    const { refetchQueries } = this.props

    if (refetchQueries) {
      // NOTE: only 1st query is refetched at the mo, to keep things simple
      return <SafeQuery {...refetchQueries[0]}>{() => content}</SafeQuery>
    }

    return content
  }

  render() {
    const {
      mutation,
      variables,
      children,
      resultKey,
      ...otherProps
    } = this.props

    const { succeeded } = this.state

    return (
      <SafeMutation
        mutation={mutation}
        variables={variables}
        {...otherProps}
        onCompleted={this._onCompleted}
        refetchQueries={[]}
      >
        {(mutator, result) => {
          const content = children(mutator, { ...this.state })

          return succeeded ? this._renderWithSuccessQuery(content) : content
        }}
      </SafeMutation>
    )
  }
}

export const ChainMutationResult = ({ children, result }) => {
  const { inProgress, percentComplete, succeeded, error } = result

  let extraContent = null

  if (error) {
    extraContent = <ErrorBox>{`${error}`}</ErrorBox>
  } else if (inProgress) {
    extraContent = <div>Awaiting confirmation ({percentComplete}%)</div>
  } else if (succeeded) {
    extraContent = <div>Success!</div>
  }

  return (
    <>
      {children}
      {extraContent}
    </>
  )
}
