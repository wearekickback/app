import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { AllPartiesQuery, AllEventsQuery } from '../graphql/queries'
import { Link } from 'react-router-dom'

import Loader from '../components/Loader'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <h2>All parties</h2>
        <Query query={AllPartiesQuery}>
          {({ data: { parties } = {}, loading }) => {
            if (loading) return <Loader />
            return parties ? (
              <div>
                {parties.map(party => (
                  <li>
                    <Link to={`/party/${party.address}`}>{party.name}</Link>
                  </li>
                ))}
              </div>
            ) : (
              <div>No parties to show!</div>
            )
          }}
        </Query>
        <h2>All events</h2>
        <Query query={AllEventsQuery}>
          {({ data: { events } = {}, loading }) => {
            if (loading) return <Loader />
            return events ? (
              <div>
                {events.map(party => (
                  <li>
                    <Link to={`/party/${party.address}`}>{party.name}</Link>
                  </li>
                ))}
              </div>
            ) : (
              <div>No events to show!</div>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default Home
