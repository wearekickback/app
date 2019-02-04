import React from 'react'
import styled from 'react-emotion'
import { getSocialId } from '@wearekickback/shared'

import DefaultAvatar from './Avatar'

const Avatar = styled(DefaultAvatar)`
  height: 35px;
  width: 35px;
  flex-shrink: 0;
`

const TwitterAvatar = ({ className, user }) => {
  const avatarId = getSocialId(user.social, 'twitter')
  const avatarUrl = `https://avatars.io/twitter/${avatarId ||
    'randomtwitter+12345'}/medium`

  let props = { src: avatarUrl }

  if (avatarId) {
    props.href = `https://twitter.com/${avatarId}`
  }

  return <Avatar className={className} {...props} />
}

export default TwitterAvatar
