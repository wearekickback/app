import React, { Fragment } from 'react'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolutionRP'

const InputAddressContainer = styled('div')``

const InputAddress = ({ address }) => {
  return (
    <InputAddressContainer>
      <ReverseResolution address={address}>
        {({ address, name }) => {
          if (name) {
            return (
              <Fragment>
                <span>name: {name}</span>
                <span>address: {address}</span>
              </Fragment>
            )
          } else {
            return (
              <Fragment>
                <span>address: {address}</span>
              </Fragment>
            )
          }
        }}
      </ReverseResolution>
    </InputAddressContainer>
  )
}

export default InputAddress
