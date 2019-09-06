import React, { useContext } from 'react'
import styled from 'react-emotion'
import { getSocialId } from '@wearekickback/shared'
import EventList from './EventList'
import { H2, H3 } from '../Typography/Basic'
import mq from 'mediaQuery'
import { EDIT_PROFILE } from '../../modals'
import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'

const UserProfileWrapper = styled('div')`
  display: flex;
`

const UserProfileContainer = styled('article')`
  max-width: 700px;
  border-radius: 20px;
`

const ProfileDetails = styled('div')`
  margin-bottom: 20px;
  display: flex;
`

const Information = styled('div')`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
`

const AvatarWrapper = styled('div')`
  max-width: 150px;
`

const Avatar = styled('img')`
  border-radius: 50%;
  width: 100%;
  border: solid 1px #efefef;
  margin: 0 auto 0;
  margin-left: -2px;
`

const Events = styled('div')`
  display: flex;
  flex-direction: column;
  ${mq.medium`
    flex-direction: row;
  `}
`

const EventType = styled('div')`
  margin-right: 25px;
  &:last-child {
    margin-right: 0;
  }
`

const EditProfile = styled(Button)`
  margin-top: 20px;
`

export default function UserProfile({ profile: p }) {
  const twitter = getSocialId(p.social, 'twitter')
  const { showModal, loggedIn, userProfile } = useContext(GlobalConsumer)
  console.log(userProfile)
  return (
    <UserProfileWrapper>
      <UserProfileContainer>
        <ProfileDetails>
          <AvatarWrapper>
            <Avatar src={`https://avatars.io/twitter/${twitter}`} />
          </AvatarWrapper>
          <Information>
            <H2>{p.username}</H2>
            {twitter && (
              <a href={`https://twitter.com/${twitter}`}>Twitter: {twitter}</a>
            )}
            {loggedIn && userProfile.username === p.username && (
              <EditProfile onClick={() => showModal({ name: EDIT_PROFILE })}>
                Edit Profile
              </EditProfile>
            )}
          </Information>
        </ProfileDetails>
        <Events>
          <EventType>
            <H3>Events Attended ({p.eventsAttended.length})</H3>
            <EventList events={p.eventsAttended} />
          </EventType>
          <EventType>
            <H3>Events Hosted ({p.eventsHosted.length})</H3>
            <EventList events={p.eventsHosted} />
          </EventType>
        </Events>
      </UserProfileContainer>
    </UserProfileWrapper>
  )
}
