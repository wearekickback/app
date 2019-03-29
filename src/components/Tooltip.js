import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import uuid from 'uuid'
import ReactTooltip from 'react-tooltip'
import styled from 'react-emotion'

const DefaultTooltip = styled(ReactTooltip)`
  z-index: 1;
  max-width: 80%;
`

export default class Tooltip extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  }

  state = {}

  componentDidMount() {
    this.id = uuid()
    this.componentDidUpdate()
  }

  componentDidUpdate() {
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

  render() {
    const { text, position, children } = this.props

    return (
      <>
        {children({
          showTooltip: this.show,
          hideTooltip: this.hide,
          tooltipElement: (
            <span data-tip={text} data-for={this.id} ref={this._onRef} />
          )
        })}
        <DefaultTooltip
          id={this.id}
          event="dbclick"
          place={position || 'top'}
          effect="solid"
          type="dark"
        />
      </>
    )
  }

  show = () => {
    this.setState({ show: true })
  }

  hide = () => {
    this.setState({ show: false })
  }
}
