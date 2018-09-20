import React from 'react'
import styled from 'react-emotion'

const InputContainer = styled('div')``
const Input = styled('input')``

const TextInput = ({ placeholder = '', innerRef }) => (
  <InputContainer>
    <Input type="text" placeholder={placeholder} innerRef={innerRef} />
  </InputContainer>
)

export default TextInput
