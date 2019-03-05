import React, { Component } from 'react'
import styled from 'react-emotion'

import FieldErrors from './FieldErrors'

const InputContainer = styled('div')`
  position: relative;
  margin-bottom: 20px;
`
const Input = styled('input')`
  height: 40px;
  font-size: 14px;
  color: #1e1e1e;
  border-radius: 2px;
  border: 1px solid #edeef4;
  padding-left: 30px;
  ${({ wide }) => wide && `width: 100%`};
  &:focus {
    outline: 0;
    border: 1px solid #6e76ff;
  }
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #ccced8;
    opacity: 1; /* Firefox */
  }
`

const SearchContainer = styled(InputContainer)`
  background-color: rgba(243, 243, 249, 0.5);
`

const SearchInput = styled(Input)`
  background-color: rgba(243, 243, 249, 0.5);
`

export class Search extends Component {
  render() {
    const { placeholder = '', Icon, innerRef, onUpdate, ...props } = this.props

    let SearchIcon
    if (Icon) {
      SearchIcon = styled(Icon)`
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translate(0, -50%);
      `
    }
    return (
      <SearchContainer {...props}>
        {Icon ? <SearchIcon /> : ''}
        <SearchInput
          type="text"
          placeholder={placeholder}
          innerRef={innerRef}
          {...props}
          onChange={this._onChange}
        />
      </SearchContainer>
    )
  }

  _onChange = e => {
    this.props.onUpdate(e.target.value)
  }
}

export default class TextInput extends Component {
  render() {
    const {
      errors,
      placeholder = '',
      innerRef,
      onUpdate,
      ...props
    } = this.props

    return (
      <InputContainer {...props}>
        <Input
          type="text"
          placeholder={placeholder}
          innerRef={innerRef}
          {...props}
          onChange={this._onChange}
        />
        <FieldErrors errors={errors} />
      </InputContainer>
    )
  }

  _onChange = e => {
    this.props.onUpdate(e.target.value)
  }
}
