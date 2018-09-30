import React, { Component } from 'react'
import styled from 'react-emotion'
import { Search } from '../Forms/TextInput'

class EventFilters extends Component {
  render() {
    const { handleSearch } = this.props
    return (
      <EventFiltersContainer>
        <Search type="text" onChange={handleSearch} wide />
      </EventFiltersContainer>
    )
  }
}

const EventFiltersContainer = styled('div')``

export default EventFilters
