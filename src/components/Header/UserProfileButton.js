import React from 'react'
import styled from '@emotion/styled'

import TwitterAvatar from '../User/TwitterAvatar'

const Account = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`
const Username = styled('div')`
  max-width: 100px;
  color: #6e76ff;
  font-family: 'Muli';
  margin-right: 5px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const UserProfileButton = ({ userProfile }) => {
  return (
    <Account>
      <Username data-testid="userprofile-name">{userProfile.username}</Username>
      <TwitterAvatar user={userProfile} size={10} scale={4} />
    </Account>
  )
}

export default UserProfileButton
