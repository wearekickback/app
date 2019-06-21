import React from 'react'
import styled from 'react-emotion'
import { getSocialId } from '@wearekickback/shared'
import EventAttended from './EventAttended'
import { H2, H3, P } from '../Typography/Basic'

const UserProfileContainer = styled('article')``
const Avatar = styled('img')`
  border-radius: 50%;
`

export default function UserProfile({ profile: p }) {
  const twitter = getSocialId(p.social, 'twitter')
  return (
    <UserProfileContainer>
      <Avatar src={`https://avatars.io/twitter/${twitter}`} />
      <H2>{p.username}</H2>
      {twitter && (
        <a href={`https://twitter.com/${twitter}`}>Twitter: {twitter}</a>
      )}

      <H3>Events Attended ({p.eventsAttended.length})</H3>
      {p.eventsAttended.map(event => (
        <EventAttended event={event} />
      ))}
    </UserProfileContainer>
  )
}
