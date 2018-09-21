import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'

import Loader from './Loader'
import ErrorBox from './ErrorBox'

const DEFAULT_IS_LOADING = ({ loading }) => loading
const DEFAULT_RENDER_ERROR = ({ error }) => <ErrorBox>{`${error}`}</ErrorBox>
const DEFAULT_RENDER_LOADING = () => <Loader />

export default class SafeMutation extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  render () {
    const {
      mutation,
      variables,
      children,
      isLoading = DEFAULT_IS_LOADING,
      renderError = DEFAULT_RENDER_ERROR,
      renderLoading = DEFAULT_RENDER_LOADING,
    } = this.props

    return (
      <Mutation mutation={mutation} variables={variables}>
        {(mutator, result) => {
          return (
            <div>
              {children(mutator, result.data || {})}
              {result.error ? renderError(result) : null}
              {isLoading(result) ? renderLoading(result) : null}
            </div>
          )
        }}
      </Mutation>
    )
  }
}
