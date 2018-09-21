import React from 'react'
import styled from 'react-emotion'

const ErrorDiv = styled('div')`
  width: 100%;
  background: #f00;
  color: #fff;
  padding: 1em 2em;
  justify-content: space-between;
`

export default ({ children }) => (
  <ErrorDiv>{children}</ErrorDiv>
)
