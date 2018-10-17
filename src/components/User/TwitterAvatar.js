import React from 'react'
import { getSocial } from '../../utils/parties'

const TwitterAvatar = ({ social, avatar }) => {
  console.log('social', social)
  const avatarId = getSocial(social,'twitter')
  const avatarUrl = `https://avatars.io/twitter/${avatarId || 'randomtwitter+12345'}/medium`
  let props = { src: avatarUrl}
  if(avatarId){
    props.href = `https://twitter.com/${avatarId}`
  }
  const Avatar = avatar
  return <Avatar {...props} />  
}

export default TwitterAvatar