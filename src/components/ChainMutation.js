import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'

import { events, getTransactionReceipt } from '../api/web3'
import SafeQuery from './SafeQuery'
import ErrorBox from './ErrorBox'
import { NEW_BLOCK } from '../utils/events'
import { NUM_CONFIRMATIONS } from '../config'

export default class ChainMutation extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    resultKey: PropTypes.string.isRequired
  }

  state = {}

  componentDidMount() {
    events.on(NEW_BLOCK, this._onNewBlock)
  }

  componentWillUnmount() {
    events.off(NEW_BLOCK, this._onNewBlock)
  }

  async _updateState (tx, blockNumber) {
    // confirmations
    const numConfirmations = blockNumber - tx.blockNumber
    const percentComplete = NUM_CONFIRMATIONS ? parseInt((numConfirmations / NUM_CONFIRMATIONS) * 100.0) : 100
    const loading = numConfirmations < NUM_CONFIRMATIONS

    // check result
    let error
    if (!loading) {
      const real = await getTransactionReceipt(tx.transactionHash)
      error = _.get(real, 'status') ? undefined : new Error('Transaction error')
    }

    this.setState({
      tx,
      progress: {
        numConfirmations,
        percentComplete,
      },
      loading,
      error
    })
  }

  _onNewBlock = async block => {
    const { tx, loading } = this.state

    if (tx && loading) {
      await this._updateState(tx, block.number)
    }
  }

  _onCompleted = async result => {
    const { resultKey } = this.props

    if (result.error) {
      this.setState({
        loading: false,
        error: result.error
      })

      return
    }

    const tx = result[resultKey]

    await this._updateState(tx, tx.blockNumber)
  }

  _renderWithSuccessQuery = content => {
    const { refetchQueries } = this.props

    if (refetchQueries) {
      // NOTE: only 1st query is refetched at the mo, to keep things simple
      return (
        <SafeQuery {...refetchQueries[0]} fetchPolicy="cache-and-network">
          {() => content}
        </SafeQuery>
      )
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

    const { tx, progress, loading, error } = this.state
    const succeeded = tx && !error && !loading
    const successProps = succeeded ? {
      [resultKey]: tx,
      data: tx,
    } : null

    return (
      <Mutation
        mutation={mutation}
        variables={variables}
        {...otherProps}
        onCompleted={this._onCompleted}
        refetchQueries={[]}
      >
        {mutator => {
          const content = children(mutator, { progress, loading, error, ...successProps })

          return succeeded ? this._renderWithSuccessQuery(content) : content
        }}
      </Mutation>
    )
  }
}

export const ChainMutationResult = ({ children, result }) => {
  const { data, progress, loading, error } = result

  let extraContent = null

  if (error) {
    extraContent = <ErrorBox>{`${error}`}</ErrorBox>
  } else if (loading) {
    extraContent = (
      <div>
        Awaiting confirmation ({progress.percentComplete}
        %)
      </div>
    )
  } else if (data) {
    extraContent = <div>Success!</div>
  }

  return (
    <>
      {children}
      {extraContent}
    </>
  )
}
