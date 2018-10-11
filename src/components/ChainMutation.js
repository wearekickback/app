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

  _onNewBlock = async block => {
    const { tx, loading } = this.state

    if (tx && loading) {
      // confirmations
      const numConfirmations = block.number - tx.blockNumber
      const percentComplete = parseInt(
        (numConfirmations / NUM_CONFIRMATIONS) * 100.0
      )
      const loading = numConfirmations < NUM_CONFIRMATIONS

      // check result

      let error
      if (!loading) {
        const real = await getTransactionReceipt(tx.transactionHash)
        error = !_.get(real, 'status')
      }

      this.setState({
        numConfirmations,
        percentComplete,
        loading,
        error
      })
    }
  }

  _onCompleted = result => {
    const { resultKey } = this.props

    if (result.error) {
      this.setState({
        error: result.error
      })

      return
    }

    const tx = result[resultKey]

    if (tx) {
      this.setState({
        tx,
        percentComplete: NUM_CONFIRMATIONS > 0 ? 0 : 100,
        loading: NUM_CONFIRMATIONS > 0 ? true : false,
        error: undefined
      })
    }
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

    const { succeeded } = this.state

    return (
      <Mutation
        mutation={mutation}
        variables={variables}
        {...otherProps}
        onCompleted={this._onCompleted}
        refetchQueries={[]}
      >
        {(mutator, result) => {
          const { tx, percentComplete, loading, error } = this.state
          const content = children(mutator, {
            data: { tx, percentComplete },
            loading,
            error
          })

          return succeeded ? this._renderWithSuccessQuery(content) : content
        }}
      </Mutation>
    )
  }
}

export const ChainMutationResult = ({ children, result }) => {
  const { loading, percentComplete, succeeded, error } = result

  let extraContent = null

  if (error) {
    extraContent = <ErrorBox>{`${error}`}</ErrorBox>
  } else if (loading) {
    extraContent = (
      <div>
        Awaiting confirmation ({percentComplete}
        %)
      </div>
    )
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
