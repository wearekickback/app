import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <Query query={EthersQuery}>
          {({ data }) => {
            console.log(data)
            return <div>hello</div>
          }}
        </Query>
      </div>
    )
  }
}

const EthersQuery = gql`
  query ethers {
    ethers @client {
      ethers
    }
  }
`

export default Home
