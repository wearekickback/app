import React from 'react'
import styled from '@emotion/styled'
import { getSocialId } from '@wearekickback/shared'

import DefaultAvatar from './Avatar'

const Avatar = styled(DefaultAvatar)`
  height: 28px;
  width: 28px;
  flex-shrink: 0;
`

const TwitterAvatar = ({ className, user, size, scale }) => {
  const avatarId = getSocialId(user.social, 'twitter')
  let avatarUrl
  let blockies

  if (avatarId) {
    avatarUrl = `https://res.cloudinary.com/dlxrqqprn/image/twitter_name/w_60,h_60/${avatarId}`
  } else {
    blockies = user.address
  }

  return (
    <Avatar
      className={className}
      src={avatarUrl}
      blockies={blockies}
      username={user.username}
      size={size}
      scale={scale}
    />
  )
}

export default TwitterAvatar
