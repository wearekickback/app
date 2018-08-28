import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { AllPartiesQuery } from '../graphql/queries'
import { Link } from 'react-router-dom'

import Loader from '../components/Loader'

class Home extends Component {
  render() {
    return (
      <div className="App">
        <Query query={AllPartiesQuery}>
          {({ data, loading }) => {
            if (loading) return <Loader />
            return (
              <div>
                {data.parties.map(party => (
                  <li>
                    <Link to={`/party/${party.address}`}>{party.name}</Link>
                  </li>
                ))}
              </div>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default Home
