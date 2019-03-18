import React, { Fragment } from 'react'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolutionRP'

const InputAddressContainer = styled('div')`
  border: 1px solid #edeef4;
  padding: 10px 15px;
  margin-bottom: 20px;
`
const Name = styled('div')``
const Address = styled('div')`
  font-family: 'Source Code Pro';
  color: ${({ faded }) => (faded ? '#ccc' : '#2b2b2b')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const InputAddress = ({ address }) => {
  return (
    <InputAddressContainer>
      <ReverseResolution address={address}>
        {({ address, name }) => {
          if (name) {
            return (
              <Fragment>
                <Name>{name}</Name>
                <Address faded>{address}</Address>
              </Fragment>
            )
          } else {
            return (
              <Fragment>
                <Address>{address}</Address>
              </Fragment>
            )
          }
        }}
      </ReverseResolution>
    </InputAddressContainer>
  )
}

export default InputAddress
