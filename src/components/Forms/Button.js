import React from 'react'
import styled from 'react-emotion'

function getButtonStyles(type) {
  switch (type) {
    case 'hollow':
      return `
        color: #5D64DE;
        background-color: transparent;
      `
    default:
      return ''
  }
}

const ButtonContainer = styled('button')`
  background-color: #6e76ff;
  border-radius: 4px;
  border: 1px solid #6e76ff;
  font-size: 14px;
  padding: 10px 20px;
  color: white;
  ${({ wide }) => (wide ? 'width: 100%' : '')};

  &:hover {
    background-color: #5d64de;
    border: 1px solid #5d64de;
  }

  &:active {
    background-color: #4c54d3;
    border: 1px solid #4c54d3;
  }

  ${({ type }) => getButtonStyles(type)};
`

const Button = ({ children, ...props }) => (
  <ButtonContainer {...props}>{children}</ButtonContainer>
)

export default Button
