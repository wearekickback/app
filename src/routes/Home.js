import React, { Component } from 'react'
import { AllPartiesQuery, AllEventsQuery } from '../graphql/queries'
import { Link } from 'react-router-dom'

import SafeQuery from'../components/SafeQuery'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <h2>All parties</h2>
        <SafeQuery query={AllPartiesQuery}>
          {({ parties }) => {
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
        </SafeQuery>
        <h2>All events</h2>
        <SafeQuery query={AllEventsQuery}>
          {({ events }) => {
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
        </SafeQuery>
      </div>
    )
  }
}

export default Home
