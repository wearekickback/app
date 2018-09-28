import React from 'react'
import styled from 'react-emotion'

const InputContainer = styled('div')``
const Input = styled('input')`
  height: 40px;
  font-size: 14px;
  color: #1e1e1e;
  border-radius: 2px;
  border: 1px solid #edeef4;

  &:focus {
    outline: 0;
    border: 1px solid #6e76ff;
  }
`

const TextInput = ({ placeholder = '', innerRef, ...props }) => (
  <InputContainer {...props}>
    <Input
      type="text"
      placeholder={placeholder}
      innerRef={innerRef}
      {...props}
    />
  </InputContainer>
)

export default TextInput
