import React, { PureComponent } from 'react'
import SingleEventWrapper from '../components/SingleEvent/SingleEventWrapper'

class SingleEvent extends PureComponent {
  state = {
    search: ''
  }

  handleSearch = event => {
    this.setState({
      search: event.target.value
    })
  }

  render() {
    const { address } = this.props.match.params
    return (
      <SingleEventWrapper
        handleSearch={this.handleSearch}
        search={this.state.search}
        address={address}
      />
    )
  }
}

export default SingleEvent
