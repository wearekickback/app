import styled from 'react-emotion'
import React from 'react'
import { ReactComponent as DefaultSuccess } from '../svg/Success.svg'

const Success = styled(DefaultSuccess)`
  path {
    fill: #6e76ff;
  }

  circle {
    stroke: #6e76ff;
  }
  margin-right: 5px;
`

const GoingContainer = styled('div')`
  background-color: #edeef4;
  border-radius: 4px;
  border: 1px solid #edeef4;
  font-size: 13px;
  font-weight: 500;
  font-family: Muli;
  padding: 10px 20px;
  color: #6e76ff;
  width: calc(100% - 120px);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    margin-right: 20px;
  }
`

const Going = ({ children }) => (
  <GoingContainer>
    <Success />
    <span>{children}</span>
  </GoingContainer>
)

export default Going
