import React from 'react'
import styled from 'react-emotion'

import { getSocial } from '../../utils/parties'
import DefaultAvatar from './Avatar'

const Avatar = styled(DefaultAvatar)`
  height: 35px;
  width: 35px;
  flex-shrink: 0;
`

const TwitterAvatar = ({ className, user }) => {
  const avatarId = getSocial(user, 'twitter')
  const avatarUrl = `https://avatars.io/twitter/${avatarId || 'randomtwitter+12345'}/medium`

  let props = { src: avatarUrl }

  if(avatarId){
    props.href = `https://twitter.com/${avatarId}`
  }

  return <Avatar className={className} {...props} />
}

export default TwitterAvatar
