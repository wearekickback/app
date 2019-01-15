import _ from 'lodash'
import React, { Component } from 'react'

import { AllPartiesQuery } from '../graphql/queries'
import EventCard from '../components/EventList/EventCard'
import EventCardGrid from '../components/EventList/EventCardGrid'
import Loader from '../components/Loader'
import SafeQuery from '../components/SafeQuery'

class AllEvents extends Component {
  _renderLoading = () => <Loader large />

  render() {
    return (
      <>
        <h2>All events</h2>
        <SafeQuery
          query={AllPartiesQuery}
          isLoading={result => !_.get(result, 'data.parties')}
          renderLoading={this._renderLoading}
        >
          {({ data: { parties } }) => {
            return (
              <EventCardGrid>
                {parties.map((party, index) => (
                  <EventCard party={party} key={index} />
                ))}
              </EventCardGrid>
            )
          }}
        </SafeQuery>
      </>
    )
  }
}

export default AllEvents
