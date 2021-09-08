import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import Blockies from 'react-blockies'
const POAPImg = styled(`img`)`
  width: 20px;
  position: absolute;
`

const AvatarContainer = styled('div')`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  overflow: hidden;
`

const Avatar = ({
  hasPOAP,
  href,
  username,
  src,
  className,
  blockies,
  size = 8,
  scale = 8
}) => {
  let container
  let Img = src ? (
    <img src={src} alt="avatar" />
  ) : (
    <Blockies seed={blockies} size={size} scale={scale} />
  )

  if (href) {
    container = (
      <AvatarContainer className={className}>
        {hasPOAP && <POAPImg src="https://poap.gallery/favicon.ico" />}
        <a href={href} target="_blank" rel="noopener noreferrer">
          {Img}
        </a>
      </AvatarContainer>
    )
  } else if (username) {
    container = (
      <AvatarContainer className={className}>
        {hasPOAP && <POAPImg src="https://poap.gallery/favicon.ico" />}
        <Link to={`/user/${username}`}>{Img}</Link>
      </AvatarContainer>
    )
  } else {
    container = <AvatarContainer className={className}>{Img}</AvatarContainer>
  }

  return container
}

export default Avatar
