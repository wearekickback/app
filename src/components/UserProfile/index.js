import React from 'react'
import styled from 'react-emotion'
import { getSocialId } from '@wearekickback/shared'
import EventAttended from './EventAttended'
import { H2, H3, P } from '../Typography/Basic'

const UserProfileContainer = styled('article')``

export default function UserProfile({ profile: p }) {
  const twitter = getSocialId(p.social, 'twitter')
  return (
    <UserProfileContainer>
      <H2>{p.id}</H2>
      <P>{p.username}</P>
      {twitter && (
        <a href={`https://twitter.com/${twitter}`}>Twitter: {twitter}</a>
      )}

      <H3>Events Attended ({eventsAttended.length})</H3>
      {p.eventsAttended.map(event => (
        <EventAttended event={event} />
      ))}
    </UserProfileContainer>
  )
}
