import React from 'react'
import styled from 'react-emotion'

const AvatarContainer = styled('div')`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  overflow: hidden;
`

const Avatar = ({ src, className }) => (
  <AvatarContainer className={className}>
    <img src={src} alt="avatar" />
  </AvatarContainer>
)

export default Avatar
