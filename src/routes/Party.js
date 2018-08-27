import React, { Component } from 'react'
import styled from 'react-emotion'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

class SingleParty extends Component {
  render() {
    return (
      <SinglePartyContainer>
        <Query
          query={EthersQuery}
          variables={{ address: this.props.match.params.address }}
        >
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
  query ethers($address: String) {
    ethers @client {
      ethers
    }
    party(address: $address) @client {
      attendees
    }
  }
`

export default SingleParty
