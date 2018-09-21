import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import PropTypes from 'prop-types'
import { Query as ReactApolloQuery } from 'react-apollo'

import Loader from './Loader'

const GraphQLError = styled('div')`
  background-color: #fff;
  color: #fff;
  padding: 1em;
  border-radius: 10px;
`

const DEFAULT_IS_LOADING = ({ loading }) => loading
const DEFAULT_RENDER_ERROR = ({ error }) => <GraphQLError>{error}</GraphQLError>
const DEFAULT_RENDER_LOADING = () => <Loader />

export default class Query extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  render () {
    const {
      query,
      variables,
      children,
      isLoading = DEFAULT_IS_LOADING,
      renderError = DEFAULT_RENDER_ERROR,
      renderLoading = DEFAULT_RENDER_LOADING,
    } = this.props

    return (
      <ReactApolloQuery query={query} variables={variables}>
        {result => {
          const { error } = result

          if (error) return renderError(result)
          if (isLoading(result)) return renderLoading(result)

          return children(result.data || {})
        }}
      </ReactApolloQuery>
    )
  }
}
