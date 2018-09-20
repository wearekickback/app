import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_REVERSE_RECORD = gql`
  query getReverseRecord($address: String) @client {
    getReverseRecord(address: $address) {
      name
      address
    }
  }
`

class ReverseResolution extends Component {
  render() {
    return (
      <Query
        query={GET_REVERSE_RECORD}
        variables={{ address: this.props.address }}
      >
        {({ data, loading, error }) => {
          console.log(data)
          const { getReverseRecord } = data
          if (loading)
            return this.props.children({
              address: this.props.address,
              name: null
            })
          if (!getReverseRecord.name) {
            return this.props.children({
              address: this.props.address,
              name: null
            })
          }
          return this.props.children({
            address: this.props.address,
            name: getReverseRecord.name
          })
        }}
      </Query>
    )
  }
}

export default ReverseResolution
