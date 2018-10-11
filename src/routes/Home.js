import React, { Component } from 'react'
import { AllPartiesQuery } from '../graphql/queries'
import { Link } from 'react-router-dom'
import EventCard from '../components/EventList/EventCard'

import SafeQuery from '../components/SafeQuery'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <h2>All parties</h2>
        <SafeQuery query={AllPartiesQuery}>
          {({ parties }) => {
            return parties ? (
              <div>
                {parties.map((party, index) => (
                  <li key={index}>
                    <Link to={`/party/${party.address}`}>
                      <EventCard party={party} />
                    </Link>
                  </li>
                ))}
              </div>
            ) : (
              <div>No parties to show!</div>
            )
          }}
        </SafeQuery>
      </div>
    )
  }
}

export default Home
