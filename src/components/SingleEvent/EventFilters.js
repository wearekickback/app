import React, { Component } from 'react'
import styled from 'react-emotion'

import { Search } from '../Forms/TextInput'
import Label from '../Forms/Label'
import Select from '../Forms/Select'
import { ReactComponent as SearchIcon } from '../svg/Search.svg'
import { GlobalConsumer } from '../../GlobalState'

const Filter = styled('div')`
  width: 200px;
  margin-bottom: 20px;
`

class EventFilters extends Component {
  render() {
    const { handleSearch, handleFilterChange, amAdmin, party } = this.props
    return (
      <EventFiltersContainer>
        {amAdmin &&
          !ended(
            <Filter>
              <Label>Filters</Label>
              <Select
                onChange={handleFilterChange}
                placeholder="Choose"
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Not marked attended', value: 'unmarked' },
                  { label: 'Marked attended', value: 'marked' }
                ]}
              />
            </Filter>
          )}

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
