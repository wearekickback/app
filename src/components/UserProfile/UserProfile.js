import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { getSocialId } from '@wearekickback/shared'
import EventList from './EventList'
import { H2, H3 } from '../Typography/Basic'
import mq from '../../mediaQuery'
import { EDIT_PROFILE } from '../../modals'
import GlobalContext from '../../GlobalState'
import Button from '../Forms/Button'
import DefaultTwitterAvatar from '../User/TwitterAvatar'
import { depositValue } from '../Utils/DepositValue'
import { Link } from 'react-router-dom'
import { SNAPSHOT_VOTES_SUBGRAPH_QUERY } from '../../graphql/queries'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import { getDateFromUnix } from '../../utils/dates'

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'https://hub.snapshot.page/graphql'
})
const graphClient = new ApolloClient({ cache, link })

const EventLink = styled(Link)``

const ContributionList = styled('ul')`
  list-style: none;
`

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
  const twitter = getSocialId(p.social, 'twitter')
  const { showModal, loggedIn, userProfile, signOut, wallet } = useContext(
    GlobalContext
  )
  let walletLink
  const { loading, error, data: snapshotData } = useQuery(
    SNAPSHOT_VOTES_SUBGRAPH_QUERY,
    {
      variables: { userAddress: p.address },
      client: graphClient
    }
  )
  console.log({ snapshotData })
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
                {wallet.type === 'sdk' && wallet.dashboard && (
                  <Button onClick={wallet.dashboard}>
                    {wallet.name} Dashboard
                  </Button>
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
          <EventType>
            <H3>Events Contributed ({p.eventsContributed.length})</H3>
            <ContributionList>
              {p.eventsContributed.map(t => {
                return (
                  <li>
                    Contributed {depositValue(t.amount, t.decimals, 3)}{' '}
                    {t.symbol} to{' '}
                    <EventLink to={`/user/${t.recipientUsername}`}>
                      {t.recipientUsername}
                    </EventLink>{' '}
                    at{' '}
                    <EventLink to={`/event/${t.partyAddress}`}>
                      {t.name}
                    </EventLink>
                  </li>
                )
              })}
            </ContributionList>
          </EventType>
          <EventType>
            <H3>
              Contribution received ({p.eventsContributionReceived.length})
            </H3>
            <ContributionList>
              {p.eventsContributionReceived.map(t => {
                return (
                  <li>
                    Received {depositValue(t.amount, t.decimals, 3)} {t.symbol}{' '}
                    from{' '}
                    <EventLink to={`/user/${t.senderUsername}`}>
                      {t.senderUsername}
                    </EventLink>{' '}
                    at{' '}
                    <EventLink to={`/event/${t.partyAddress}`}>
                      {t.name}
                    </EventLink>
                  </li>
                )
              })}
            </ContributionList>
          </EventType>
          {snapshotData && snapshotData.votes.length > 0 && (
            <EventType>
              <H3>Snapshot governance participated</H3>
              <ContributionList>
                {snapshotData.votes.map(v => {
                  return (
                    <li>
                      <a
                        href={`https://snapshot.org/#/${v.space.id}/proposal/${v.proposal}`}
                      >
                        Voted {v.choice} on {v.space.id}
                      </a>{' '}
                      at {getDateFromUnix(v.created)}
                    </li>
                  )
                })}
              </ContributionList>
            </EventType>
          )}
        </Events>
      </UserProfileContainer>
    </UserProfileWrapper>
  )
}
