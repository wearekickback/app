import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

const AvatarContainer = styled('div')`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  overflow: hidden;
`

const Avatar = ({ href, username, src, className }) => {
  let container

  if (href) {
    container = (
      <AvatarContainer className={className}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <img src={src} alt="avatar" />
        </a>
      </AvatarContainer>
    )
  } else if (username) {
    container = (
      <AvatarContainer className={className}>
        <Link to={`/user/${username}`}>
          <img src={src} alt="avatar" />
        </Link>
      </AvatarContainer>
    )
  } else {
    container = (
      <AvatarContainer className={className}>
        <img src={src} alt="avatar" />
      </AvatarContainer>
    )
  }
  return container
}

export default Avatar
