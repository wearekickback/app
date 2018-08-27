import React, { Component } from 'react'
import styled from 'react-emotion'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

class SingleParty extends Component {
  render() {
    return (
      <SinglePartyContainer>
        <Query query={EthersQuery}>
          {({ data }) => {
            console.log(data)
            return <div>hello</div>
          }}
        </Query>
      </SinglePartyContainer>
    )
  }
}

const SinglePartyContainer = styled('div')``

const EthersQuery = gql`
  query ethers {
    ethers @client {
      ethers
    }
  }
`

export default SingleParty
