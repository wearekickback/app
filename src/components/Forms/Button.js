import React from 'react'
import styled from 'react-emotion'

const ButtonContainer = styled('button')``

const Button = ({ children, ...props }) => (
  <ButtonContainer {...props}>{children}</ButtonContainer>
)

export default Button
