import React, { Component } from "react"
import SingleEventWrapper from "../components/SingleEvent/SingleEventWrapper"

class SingleEvent extends Component {
  render() {
    const { address } = this.props.match.params
    return <SingleEventWrapper address={address} />
  }
}

export default SingleEvent
