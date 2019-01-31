import React from 'react'
import styled from 'react-emotion'

const LabelContainer = styled('label')`
  margin-bottom: 10px;
  display: block;
  font-family: Muli;
  font-weight: 700;
  font-size: 14px;
  color: #3d3f50;
  line-height: 21px;
`

const SecondaryText = styled('span')`
  color: rgba(0, 0, 0, 0.2);
  margin-left: 5px;
`

const Label = ({ children, optional = false }) => (
  <LabelContainer>
    {children}
    <SecondaryText>{optional ? '(optional)' : null}</SecondaryText>
  </LabelContainer>
)

export default Label
