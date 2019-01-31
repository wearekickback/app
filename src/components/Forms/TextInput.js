import React from 'react'
import styled from 'react-emotion'

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
  width: 200px;
  padding-left: 20px;
  ${({ wide }) => wide && `width: 100%`};
  &:focus {
    outline: 0;
    border: 1px solid #6e76ff;
  }
  ::placeholder {
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

export const Search = ({ placeholder = '', Icon, innerRef, ...props }) => {
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
      />
    </SearchContainer>
  )
}

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
