import React from 'react'
import { Query } from 'react-apollo'
import Loader from '../components/Loader'
import UserProfile from '../components/UserProfile'

import {
  USER_PROFILE_DETAILED_QUERY,
  USER_PROFILE_QUERY
} from '../graphql/queries'

export default function UserProfileData(props) {
  const { username } = props.match.params
  return (
    <Query query={USER_PROFILE_DETAILED_QUERY} variables={{ username }}>
      {({ data, loading, error }) => {
        if (loading) return <Loader />
        if (error) {
          console.log(error)
          return <div>Could not find user of the username: {username}</div>
        }
        return <UserProfile profile={data.profile} />
      }}
    </Query>
  )
}
