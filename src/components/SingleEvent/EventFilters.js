import React, { Component } from 'react'
import styled from 'react-emotion'
import { Search } from '../Forms/TextInput'
import { ReactComponent as SearchIcon } from '../svg/Search.svg'
import Select from 'react-select'
import { GlobalConsumer } from '../../GlobalState'

const Filter = styled('div')``

class EventFilters extends Component {
  render() {
    const { handleSearch } = this.props
    return (
      <EventFiltersContainer>
        <Filter>
          <GlobalConsumer>
            {({ handleFilterChange }) => (
              <Select
                onChange={handleFilterChange}
                options={[{ label: 'Unmarked', value: 'unmarked' }]}
              />
            )}
          </GlobalConsumer>
        </Filter>
        <Search
          type="text"
          Icon={SearchIcon}
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
