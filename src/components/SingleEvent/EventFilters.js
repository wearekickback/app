import React, { Component } from 'react'
import styled from 'react-emotion'
import { Search } from '../Forms/TextInput'
import { ReactComponent as SearchIcon } from '../svg/Search.svg'
import { GlobalConsumer } from '../../GlobalState'

class EventFilters extends Component {
  render() {
    const { handleSearch, search } = this.props
    return (
      <EventFiltersContainer>
        <Search
          type="text"
          Icon={SearchIcon}
          onChange={handleSearch}
          value={search}
          placeholder="Search for names or addresses"
          wide
        />
      </EventFiltersContainer>
    )
  }
}

const EventFiltersContainer = styled('div')``

export default EventFilters
