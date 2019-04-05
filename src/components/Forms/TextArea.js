import React, { Component } from 'react'
import styled from 'react-emotion'

const DefaultTextArea = styled('textarea')`
  width: 400px;
  font-size: 14px;
  padding: 10px;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #edeef4;
  padding-left: 20px;
  &:focus {
    outline: 0;
    border: 1px solid #6e76ff;
  }

  ::placeholder {
    color: #ccced8;
    opacity: 1; /* Firefox */
  }
`

export default class TextArea extends Component {
  render() {
    const { onChangeText, ...props } = this.props

    return <DefaultTextArea {...props} onChange={this._onChange} />
  }

  _onChange = e => {
    this.props.onChangeText(e.target.value)
  }
}
