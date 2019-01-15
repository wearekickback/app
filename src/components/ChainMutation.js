import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'

import {
  CANNOT_RESOLVE_ACCOUNT_ADDRESS,
  CANNOT_RESOLVE_CORRECT_NETWORK
} from '../utils/errors'
import { events, getTransactionReceipt } from '../api/web3'
import { GlobalConsumer } from '../GlobalState'
import SafeQuery from './SafeQuery'
import Tooltip from './Tooltip'
import Button from './Forms/Button'
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

  async _updateState(tx, blockNumber) {
    // confirmations
    const confirmationsSoFar =
      blockNumber >= tx.blockNumber ? blockNumber - tx.blockNumber : 0
    const percentComplete = NUM_CONFIRMATIONS
      ? parseInt((confirmationsSoFar / NUM_CONFIRMATIONS) * 100.0)
      : 100
    const stillLoading = confirmationsSoFar < NUM_CONFIRMATIONS

    // check result
    let error
    if (!stillLoading) {
      const real = await getTransactionReceipt(tx.transactionHash)
      error = _.get(real, 'status') ? undefined : new Error('Transaction error')
    }

    this.setState({
      tx,
      progress: stillLoading
        ? {
            numConfirmations: confirmationsSoFar,
            percentComplete
          }
        : null,
      error
    })
  }

  _onNewBlock = async block => {
    const { tx, progress } = this.state

    if (tx && progress) {
      await this._updateState(tx, block.number)
    }
  }

  _onError = async error => {
    this.setState({
      error
    })
  }

  _onCompleted = async result => {
    const { resultKey, onCompleted } = this.props

    const tx = result[resultKey]

    await this._updateState(tx, tx.blockNumber)

    if (onCompleted) {
      onCompleted(result)
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

    const { tx, progress, error } = this.state
    const succeeded = tx && !error && !progress
    const successProps = succeeded
      ? {
          [resultKey]: tx,
          data: tx
        }
      : null

    return (
      <Mutation
        mutation={mutation}
        variables={variables}
        {...otherProps}
        onCompleted={this._onCompleted}
        onError={this._onError}
        refetchQueries={[]}
      >
        {(mutator, { loading }) => {
          const content = children(mutator, {
            progress,
            loading,
            error,
            ...successProps
          })

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
    extraContent = <div>Sending transaction</div>
  } else if (progress) {
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

export class ChainMutationButton extends Component {
  state = {}

  componentDidUpdate() {
    const { notReadyError } = this.state
    const {
      result: { loading }
    } = this.props

    if (this.tooltip) {
      if (loading || notReadyError) {
        this.tooltip.show()
      } else {
        this.tooltip.hide()
      }
    }
  }

  _onTooltipRef = elem => {
    this.tooltip = elem
  }

  render() {
    const { notReadyError } = this.state

    const {
      result: { error, loading, progress, data: tx },
      preContent,
      postContent,
      tooltip,
      onClick,
      ...props
    } = this.props

    let content
    let after = error ? <ErrorBox>{`${error}`}</ErrorBox> : null

    if (loading) {
      content = <div>Sending transaction...</div>
    } else if (progress) {
      content = <div>Awaiting confirmation ({progress.percentComplete} %)</div>
    } else if (!loading && tx) {
      content = postContent || 'Confirmed!'
    } else {
      content = preContent
    }

    const tip =
      notReadyError ||
      tooltip ||
      'Please sign the created transaction using your wallet or Dapp browser'

    return (
      <GlobalConsumer>
        {({ networkState, reloadUserAddress }) => (
          <>
            <Tooltip text={tip} ref={this._onTooltipRef}>
              {({ tooltipElement }) => (
                <Button
                  {...props}
                  onClick={() =>
                    this._onClick({
                      networkState,
                      reloadUserAddress,
                      postMutation: onClick
                    })
                  }
                  disabled={!!(loading || progress)}
                >
                  {content}
                  {tooltipElement}
                </Button>
              )}
            </Tooltip>
            {after}
          </>
        )}
      </GlobalConsumer>
    )
  }

  _onClick = ({ networkState, reloadUserAddress, postMutation }) => {
    this.setState({ notReadyError: null }, async () => {
      const address = await reloadUserAddress()

      if (!address) {
        return this.setState({
          notReadyError: CANNOT_RESOLVE_ACCOUNT_ADDRESS
        })
      }

      if (!networkState.allGood) {
        return this.setState({
          notReadyError: CANNOT_RESOLVE_CORRECT_NETWORK
        })
      }

      postMutation()
    })
  }
}
