import React, { Fragment } from 'react'
import styled from '@emotion/styled'

import ChatRoom from 'smart-chat-react'
import { extractUsersWithGivenEventRole, ROLE } from '@wearekickback/shared'

const { Conference } = require('@wearekickback/contracts')


const ChatContainer = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 20px;
  margin-bottom: 40px;
`

const NoParticipants = styled('div')``

const Chat = props => {
  const {
    party,
    party: { participants, ended },
    web3
  } = props

  const members = party.participants.map(p => p.user.address)
  let moderators = extractUsersWithGivenEventRole(party, ROLE.EVENT_ADMIN)
  if (moderators && moderators.length > 0) {
    moderators = moderators.map(p => p.address)
  } else {
    moderators = []
  }
  const owner = moderators && moderators.length > 0 ? moderators[0] : members[0];

  console.log("party", party, owner, members, moderators)

  let canJoin = null
  let canModerate = null
  if (web3) {
    try {
      const contract = new web3.eth.Contract(Conference.abi, party.address)
      canJoin = {
        contract,
        method: "isRegistered"
      }
      canModerate = {
        contract,
        method: "isAdmin"
      }
    } catch(e) {
      console.log("Failed to load contract", party, e)
    }
  }

  return (
    <Fragment>
      <ChatContainer>
        {participants.length > 0 ? (
          <ChatRoom
            appName="Kickback"
            channelName={party.address}
            canJoin={canJoin}
            canModerate={canModerate}
            organizer={owner}
            members={members}
            moderators={moderators}
            colorTheme="#6E76FF"
            popup
          />
        ) : (
          <NoParticipants />
        )}
      </ChatContainer>
    </Fragment>
  )
}

export default Chat
