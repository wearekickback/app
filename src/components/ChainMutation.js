import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SafeMutation from './SafeMutation'

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
    } = this.props

    return (
      <SafeMutation mutation={mutation} variables={variables}>
        {(mutator, result) => {
          const tx = _.get(result, resultKey)

          // TODO: create a subscription to wait on tx confirmations

          return children(mutator, { tx, complete: !!tx })
        }}
      </SafeMutation>
    )
  }
}
