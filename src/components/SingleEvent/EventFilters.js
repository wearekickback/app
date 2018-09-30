import React, { PureComponent } from 'react'
import styled from 'react-emotion'

const Search = styled('input')``

class EventFilters extends PureComponent {
  render() {
    const { handleSearch } = this.props
    return (
      <EventFiltersContainer>
        <Search type="text" onChange={handleSearch} />
      </EventFiltersContainer>
    )
  }
}

const EventFiltersContainer = styled('div')``

export default EventFilters
