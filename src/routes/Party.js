import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import { PartyQuery } from '../graphql/queries'
import Loader from '../components/Loader'
import RSVP from '../components/Party/RSVP'
import SetLimit from '../components/Party/SetLimit'

class SingleParty extends Component {
  render() {
    const { address } = this.props.match.params
    return (
      <SinglePartyContainer>
        <Query query={PartyQuery} variables={{ address }}>
          {({ data: { party }, loading }) => {
            if (loading) {
              return <Loader />
            }
            return (
              <div>
                <RSVP address={address} />
                <SetLimit address={address} />
                {Object.entries(party).map(arr => {
                  if (arr[0] === 'participants') {
                    return ''
                  }
                  return <div>{`${arr[0]} ${arr[1]}`}</div>
                })}
                {party.participants.map(
                  ({ participantName, address, attended, paid }) => (
                    <Fragment>
                      <div>{participantName}</div>
                      <div>{address}</div>
                      <div>{attended.toString()}</div>
                      <div>{paid.toString()}</div>
                    </Fragment>
                  )
                )}
              </div>
            )
          }}
        </Query>
      </SinglePartyContainer>
    )
  }
}

const SinglePartyContainer = styled('div')``

export default SingleParty
