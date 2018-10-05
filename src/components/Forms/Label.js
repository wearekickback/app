import React from 'react'
import styled from 'react-emotion'

const LabelContainer = styled('label')`
  margin-bottom: 10px;
  display: block;
  font-family: Muli;
  font-weight: 700;
  font-size: 13px;
  color: #3d3f50;
  line-height: 21px;
`

const SecondaryText = styled('span')`
  color: rgba(0, 0, 0, 0.2);
`

const Label = ({ children, secondaryText = '' }) => (
  <LabelContainer>
    {children}
    <SecondaryText>{' ' + secondaryText}</SecondaryText>
  </LabelContainer>
)

export default Label
