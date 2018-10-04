import React from 'react'
import styled from 'react-emotion'

const AvatarContainer = styled('div')`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  overflow: hidden;
`

const Avatar = ({ src }) => (
  <AvatarContainer>
    <img src={src} />
  </AvatarContainer>
)

export default Avatar
