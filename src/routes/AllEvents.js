import React, { Component } from 'react'
import { Query } from 'react-apollo'

import { AllPartiesQuery } from '../graphql/queries'
import EventCard from '../components/EventList/EventCard'
import EventCardGrid from '../components/EventList/EventCardGrid'
import Loader from '../components/Loader'

class AllEvents extends Component {
  render() {
    return (
      <>
        <h2>All events</h2>
        <Query query={AllPartiesQuery}>
          {({ data: { parties }, loading }) => {
            if (loading) return <Loader large />
            return (
              <EventCardGrid>
                {parties.map((party, index) => (
                  <EventCard party={party} key={index} />
                ))}
              </EventCardGrid>
            )
          }}
        </Query>
      </>
    )
  }
}

export default AllEvents
