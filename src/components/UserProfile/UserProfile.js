import React, { useContext } from 'react'
import styled from 'react-emotion'
import { getSocialId } from '@wearekickback/shared'
import EventList from './EventList'
import { H2, H3 } from '../Typography/Basic'
import mq from 'mediaQuery'
import { EDIT_PROFILE } from '../../modals'
import GlobalContext from '../../GlobalState'
import { useModalContext } from '../../contexts/ModalContext'
import Button from '../Forms/Button'
import DefaultTwitterAvatar from '../User/TwitterAvatar'

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

const TwitterAvatar = styled(DefaultTwitterAvatar)`
  width: 150px;
  height: 150px;
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
  width: 100%;
  margin-bottom: 1em;
`

const ButtonContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
`

const SignOutButton = styled(Button)`
  width: 100%;
  margin-bottom: 1em;
`

const WalletButton = styled(Button)`
  width: 100%;
`

export default function UserProfile({ profile: p }) {
  const [, { showModal }] = useModalContext()
  const { loggedIn, userProfile, signOut, wallet } = useContext(GlobalContext)
  
  const twitter = getSocialId(p.social, 'twitter')

  let walletLink
  if (wallet) {
    walletLink = wallet.url
  }

  return (
    <UserProfileWrapper>
      <UserProfileContainer>
        <ProfileDetails>
          <AvatarWrapper>
            <TwitterAvatar user={p} scale={8} size={19} />
          </AvatarWrapper>
          <Information>
            <H2>{p.username}</H2>
            {twitter && (
              <a href={`https://twitter.com/${twitter}`}>Twitter: {twitter}</a>
            )}
            {loggedIn && userProfile && userProfile.username === p.username && (
              <ButtonContainer>
                {walletLink && (
                  <a
                    href={walletLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WalletButton>Open Wallet</WalletButton>
                  </a>
                )}
                <EditProfile onClick={() => showModal({ name: EDIT_PROFILE })}>
                  Edit Profile
                </EditProfile>
                <SignOutButton onClick={() => signOut()}>
                  Sign Out
                </SignOutButton>
              </ButtonContainer>
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
