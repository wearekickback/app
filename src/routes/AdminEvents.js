import _ from 'lodash'
import React, { Component } from 'react'

import { ADMIN_PARTIES_QUERY, IS_WHITELISTED } from '../graphql/queries'
import EventCard from '../components/EventList/EventCard'
import EventCardGrid from '../components/EventList/EventCardGrid'
import { getPartyImage } from '../utils/parties'
import { useQuery } from 'react-apollo'
import { GlobalConsumer } from '../GlobalState'
import Button from '../components/Forms/Button'

const AdminEventsContainer = () => {
  return (
    <GlobalConsumer>
      {({ wallet, signIn, signOut, loggedIn, userProfile, userAddress }) => {
        return <AdminEvents address={userAddress} />
      }}
    </GlobalConsumer>
  )
}
const AdminEvents = ({ address }) => {
  const { data, error, isLoading } = useQuery(ADMIN_PARTIES_QUERY)
  const { data: data2, error2, isLoading2 } = useQuery(IS_WHITELISTED, {
    variables: { address },
    skip: !address
  })
  const isWhitelisted = data2 && data2.isWhitelisted
  if ((isLoading && isLoading2) || !data) {
    return <>Loading</>
  } else if (!isWhitelisted) {
    return <>You cannot see this page</>
  } else {
    const parties = data.parties
    return (
      <EventCardGrid>
        {parties.map(party => {
          party.headerImg = getPartyImage(party.headerImg)
          return <EventCard party={party} key={party.id} />
        })}
      </EventCardGrid>
    )
  }
}

export default AdminEventsContainer
