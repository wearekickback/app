import React from 'react'
import styled from 'react-emotion'

const ErrorDiv = styled('div')`
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  max-width: 1200px;
  margin: 0 auto 20px;
`
const Inner = styled('div')`
  width: 100%;
  background: hsla(360, 88%, 62%, 0.9);
  color: #fff;
  padding: 20px 25px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.7em;
  justify-content: flex-start;
`

export default ({ children }) => (
  <ErrorDiv>
    <Inner>{children}</Inner>
  </ErrorDiv>
)
