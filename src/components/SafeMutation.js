import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'

import Loader from './Loader'
import ErrorBox from './ErrorBox'

export const DEFAULT_IS_LOADING = ({ loading }) => loading
export const DEFAULT_RENDER_ERROR = ({ error }) => {
  console.error(error)

  let errStr = `${error}`
  const errStrLowercase = errStr.toLowerCase()

  if (errStrLowercase.includes('failed to fetch')) {
    errStr =
      'We were unable to connect to our backend server. Is your internet connection working?'
  }

  return <ErrorBox>{errStr}</ErrorBox>
}
export const DEFAULT_RENDER_LOADING = () => <Loader />

export default class SafeMutation extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  render() {
    const {
      children,
      isLoading = DEFAULT_IS_LOADING,
      renderError = DEFAULT_RENDER_ERROR,
      renderLoading = DEFAULT_RENDER_LOADING,
      ...props
    } = this.props

    return (
      <Mutation {...props}>
        {(mutator, result) => {
          return (
            <>
              {children(mutator, result.data || {})}
              {result.error ? renderError(result) : null}
              {isLoading(result) ? renderLoading(result) : null}
            </>
          )
        }}
      </Mutation>
    )
  }
}
