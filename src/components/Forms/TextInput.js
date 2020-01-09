import React, { Component } from 'react'
import styled from 'react-emotion'

import FieldErrors from './FieldErrors'

const InputContainer = styled('div')`
  position: relative;
`

const InputWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  justify-content: flex-start;
`

const Prefix = styled('span')`
  display: inline-block;
  position: absolute;
  left: 15px;
  font-size: 14px;
  color: hsla(0, 0%, 75%, 1);
  font-weight: bold;
  flex: 0;
`

const Input = styled('input')`
  display: inline-block;
  height: 40px;
  font-size: 14px;
  color: #1e1e1e;
  flex: 1;
  border-radius: 6px;
  border: 1px solid ${({ hasError }) => (hasError ? '#f00' : '#edeef4')};
  padding-left: ${p => (p.hasPrefix ? '27px' : '15px')};
  ${({ wide }) => wide && `width: 100%`};
  &:focus {
    outline: 0;
    border: 1px solid ${({ hasError }) => (hasError ? '#f00' : '#6e76ff')};
  }
  ::placeholder {
    color: #ccced8;
    opacity: 1; /* Firefox */
  }
`

const SearchContainer = styled(InputContainer)`
  background-color: rgba(243, 243, 249, 0.5);
  margin-bottom: 20px;
`

const SearchInput = styled(Input)`
  padding-left: 40px;
  background-color: rgba(243, 243, 249, 0.5);
`

export class Search extends Component {
  render() {
    const {
      placeholder = '',
      Icon,
      innerRef,
      onChangeText,
      ...props
    } = this.props

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
    this.props.onChangeText(e.target.value)
  }
}

export default class TextInput extends Component {
  render() {
    const {
      errors,
      placeholder = '',
      innerRef,
      prefix,
      onChangeText,
      className,
      ...props
    } = this.props

    return (
      <InputContainer className={className}>
        <InputWrapper>
          {prefix ? <Prefix>{prefix}</Prefix> : null}
          <Input
            hasPrefix={prefix}
            type="text"
            placeholder={placeholder}
            innerRef={innerRef}
            hasError={!!errors}
            {...props}
            onChange={this._onChange}
          />
        </InputWrapper>
        <FieldErrors errors={errors} />
      </InputContainer>
    )
  }

  _onChange = e => {
    this.props.onChangeText(e.target.value)
  }
}
