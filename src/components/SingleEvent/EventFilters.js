import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import { Search } from '../Forms/TextInput'

class EventFilters extends PureComponent {
  render() {
    const { handleSearch } = this.props
    return (
      <EventFiltersContainer>
        <Search
          type="text"
          onChange={handleSearch}
          placeholder="Search for names or addresses"
          wide
        />
      </EventFiltersContainer>
    )
  }
}

const EventFiltersContainer = styled('div')``

export default EventFilters
