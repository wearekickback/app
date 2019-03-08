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

const StatusContainer = styled('div')`
  background-color: rgba(233, 234, 255, 0.5);
  border-radius: 4px;
  border: 1px solid rgba(233, 234, 255, 0.5);
  font-size: 13px;
  font-weight: 500;
  font-family: Muli;
  padding: 10px 20px;
  color: #6e76ff;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  span {
    ${p => p.going && `margin-right: 20px;`};
  }
`

export const Going = ({ children }) => (
  <StatusContainer going>
    <Success />
    <span>{children}</span>
  </StatusContainer>
)

const Status = ({ children }) => (
  <StatusContainer>
    <span>{children}</span>
  </StatusContainer>
)

export default Status
