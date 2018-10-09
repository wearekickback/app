import React from 'react'
import styled from 'react-emotion'

function getButtonStyles(type) {
  switch (type) {
    case 'light':
      return `
        color: #6e76ff;
        background-color: white;
        &:hover {
          background-color:rgba(233,234,255,0.75);
        }
      `
    case 'hollow':
      return `
        color: #5D64DE;
        background-color: transparent;
        &:hover {
          background-color:rgba(233,234,255,0.75);
        }
      `
    case 'disabled':
      return `
        color: #BCBDC5;
        background-color: #EDEEF4;
        border: 1px solid #EDEEF4;
        &:hover {
          cursor: default;
          color: #BCBDC5;
          background-color: #EDEEF4;
          border: 1px solid #EDEEF4;
        }
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
  font-family: Muli;
  padding: 10px 20px;
  color: white;
  ${({ wide }) => (wide ? 'width: 100%;' : '')};
  ${({ twoThirds }) => (twoThirds ? 'width: 66%;' : '')};
  transition: 0.2s ease-out;

  &:hover {
    cursor: pointer;
    background-color: #5d64de;
    border: 1px solid #5d64de;
  }

  &:active {
    background-color: #4c54d3;
    border: 1px solid #4c54d3;
  }

  &:focus {
    outline: 0;
  }

  ${({ type }) => getButtonStyles(type)};
`

const Button = ({ children, ...props }) => (
  <ButtonContainer {...props}>{children}</ButtonContainer>
)

export default Button
