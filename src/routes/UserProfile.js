import React from 'react'
import { Query } from 'react-apollo'
import Loader from '../components/Loader'
import UserProfile from '../components/UserProfile'

import {
  USER_PROFILE_DETAILED_QUERY,
  ENS_ADDRESS_QUERY
} from '../graphql/queries'
import { useQuery } from 'react-apollo'

export default function UserProfileData(props) {
  const { username } = props.match.params
  const isAddress = !!(username.length === 42 && username.match(/^0x/))
  const isEns = username.match(/\./)
  const { data: ensData } = useQuery(ENS_ADDRESS_QUERY, {
    variables: { name: username },
    skip: !isEns
  })
  let variables
  if (isAddress || isEns) {
    if (ensData && ensData.getEnsAddress && ensData.getEnsAddress.address) {
      variables = { address: ensData.getEnsAddress.address }
    } else {
      variables = { address: username }
    }
  } else {
    variables = { username }
  }
  return (
    <Query query={USER_PROFILE_DETAILED_QUERY} variables={variables}>
      {({ data, loading, error }) => {
        if (loading) return <Loader />
        if (error) {
          if (isAddress) {
            return <UserProfile profile={{ address: username }} />
          } else if (
            isEns &&
            ensData &&
            ensData.getEnsAddress &&
            ensData.getEnsAddress.address
          ) {
            return (
              <UserProfile
                profile={{ address: ensData.getEnsAddress.address }}
              />
            )
          } else {
            return <div>Could not find user of the username: {username}</div>
          }
        } else {
          return <UserProfile profile={data && data.profile} />
        }
      }}
    </Query>
  )
}
