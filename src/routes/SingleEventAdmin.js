import React, { Component, Fragment } from 'react'
import SingleEventWrapper from '../components/SingleEvent/SingleEventWrapper'
import SetLimit from '../components/SingleEvent/SetLimit'
import Clear from '../components/SingleEvent/Clear'
import Payback from '../components/SingleEvent/Payback'

class SingleEvent extends Component {
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
      <Fragment>
        <SetLimit address={address} />
        <Clear address={address} />
        <Payback address={address} />
        <SingleEventWrapper
          handleSearch={this.handleSearch}
          search={this.state.search}
          address={address}
        />
      </Fragment>
    )
  }
}

export default SingleEvent
