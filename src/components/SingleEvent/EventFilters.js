import React, { Component } from 'react'
import styled from 'react-emotion'
import { Search } from '../Forms/TextInput'
import { ReactComponent as SearchIcon } from '../svg/Search.svg'
import { GlobalConsumer } from '../../GlobalState'

class EventFilters extends Component {
  render() {
    const { handleSearch } = this.props
    return (
      <GlobalConsumer>
          {({ searchTerm }) => (
            <EventFiltersContainer>
              <Search
                type="text"
                Icon={SearchIcon}
                onChange={handleSearch}
                value={searchTerm}
                placeholder="Search for names or addresses"
                wide
              />
            </EventFiltersContainer>
          )}
      </GlobalConsumer>      
    )
  }
}

const EventFiltersContainer = styled('div')``

export default EventFilters
