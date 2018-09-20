import React, { Fragment } from 'react'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolutionRP'

const InputAddressContainer = styled('div')`
  border: 1px solid #ccc;
`
const Name = styled('div')``
const Address = styled('div')`
  color: ${({ faded }) => (faded ? '#ccc' : '#2b2b2b')};
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
