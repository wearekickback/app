import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SafeMutation from './SafeMutation'
import SafeSubscription from './SafeSubscription'
import { TransactionStatusSubscription } from '../graphql/subscriptions'

export default class ChainMutation extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
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
       <SafeMutation mutation={mutation} variables={variables} {...otherProps}>
        {(mutator, result) => {
          const tx = _.get(result, resultKey)

          // return tx ? (
          //   <SafeSubscription
          //     subscription={TransactionStatusSubscription}
          //     variables={{ tx: { hash: tx.hash, blockNumber: tx.blockNumber } }}
          //     {...otherProps}
          //   >
          //     {result => children(mutator, result)}
          //   </SafeSubscription>
          // ) : (
          return children(mutator, { tx, succeeded: !!tx })
          // )
        }}
      </SafeMutation>
    )
  }
}
