import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'
import TwitterAvatar from '../User/TwitterAvatar'

const Account = styled(Link)`
  display: flex;
  align-items: center;
  cursor: pointer;
`
const Username = styled('div')`
  max-width: 100px;
  color: white;
  font-family: 'Muli';
  margin-right: 5px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UserProfileButton = ({ userProfile }) => {
  return (
    <Account to={`/user/${userProfile.username}`}>
      <Username data-testid="userprofile-name">{userProfile.username}</Username>
      <TwitterAvatar user={userProfile} size={10} scale={4} />
    </Account>
  )
}

function SignInButton() {
  return (
    <GlobalConsumer>
      {({ userProfile, loggedIn, signIn, wallet }) => {
        if (!wallet) return null

        if (loggedIn && userProfile) {
          return <UserProfileButton userProfile={userProfile} />
        }
        return (
          <Button type="light" onClick={signIn} analyticsId="Sign In">
            Sign in
          </Button>
        )
      }}
    </GlobalConsumer>
  )
}

export default SignInButton
