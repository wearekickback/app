import React, { Component } from 'react'
import styled from 'react-emotion'
import { Query } from 'react-apollo'

const GetUserContainer = styled('div')``

const GET_REVERSE_RECORD = gql`
  query get($address: String) @client {
    getReverseRecord(address: $address) {
      name
      address
    }
  }
`

class GetUser extends Component {
  render(){
    return (
      <GetUserContainer>
        <Query query={}></Query>
      </GetUserContainer>
    )
  }
}

export default GetUser