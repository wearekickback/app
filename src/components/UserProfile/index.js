import React from 'react'
import styled from 'react-emotion'
import { getSocialId } from '@wearekickback/shared'
import EventAttended from './EventAttended'
import { H2, H3 } from '../Typography/Basic'

const UserProfileWrapper = styled('div')`
  display: flex;
  justify-content: center;
`

const UserProfileContainer = styled('article')`
  max-width: 500px;
  padding: 20px;
  background: #efefef;
  border-radius: 20px;
`
const Avatar = styled('img')`
  border-radius: 50%;
  max-width: 250px;
`

export default function UserProfile({ profile: p }) {
  const twitter = getSocialId(p.social, 'twitter')
  return (
    <UserProfileWrapper>
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
        <H3>Events Hosted ({p.eventsHosted.length})</H3>
        {p.eventsHosted.map(event => (
          <EventAttended event={event} />
        ))}
      </UserProfileContainer>
    </UserProfileWrapper>
  )
}
