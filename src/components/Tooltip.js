import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import uuid from 'uuid'
import ReactTooltip from 'react-tooltip'
import styled from 'react-emotion'

const DefaultTooltip = styled(ReactTooltip)`
  z-index: 1;
`

export default class Tooltip extends Component {
  state = {}

  componentDidMount () {
    this.id = uuid()
    this.componentDidUpdate()
  }

  componentDidUpdate () {
    if (!this.elem) {
      return
    }

    if (this.state.show) {
      ReactTooltip.show(findDOMNode(this.elem))
    } else {
      ReactTooltip.hide(findDOMNode(this.elem))
    }
  }

  _onRef = e => {
    this.elem = e
  }

  render () {
    const { text, children } = this.props

    const child = React.cloneElement(
      React.Children.only(children),
      {
        'data-tip': text,
        'data-for': this.id,
        'ref': this._onRef,
      }
    )

    return (
      <div>
        {child}
        <DefaultTooltip
          id={this.id}
          event="dbclick"
          place="top"
          effect="solid"
          type="dark"
        />
      </div>
    )
  }

  show () {
    this.setState({ show: true })
  }

  hide () {
    this.setState({ show: false })
  }
}
