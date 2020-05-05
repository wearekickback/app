import React, { Component, Fragment } from 'react'
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

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      members: [],
      moderators: [],
      owner: null,
      canJoin: null,
      canModerate: null
    }
  }

  async componentDidMount() {
    const { party } = this.props

    const members = party.participants.map(p => p.user.address)
    let moderators = extractUsersWithGivenEventRole(party, ROLE.EVENT_ADMIN)
    if (moderators && moderators.length > 0) {
      moderators = moderators.map(p => p.address)
    } else {
      moderators = []
    }
    this.setState({ members, moderators })
    await this.updateContract()
  }

  async componentWillReceiveProps() {
    await this.updateContract()
  }

  async updateContract() {
    const { party, web3 } = this.props
    let owner = null
    let canJoin = null
    let canModerate = null
    if (web3) {
      try {
        const contract = new web3.eth.Contract(Conference.abi, party.address)
        canJoin = {
          contract,
          method: 'isRegistered'
        }
        canModerate = {
          contract,
          method: 'isAdmin'
        }
        owner = await contract.methods.owner().call()
      } catch (e) {
        console.log('Failed to load contract', party, e)
      }
    }
    this.setState({ owner, canJoin, canModerate })
  }

  render() {
    const {
      party,
      party: { participants }
    } = this.props
    const { members, moderators, owner, canJoin, canModerate } = this.state

    if (!owner) {
      return <div></div>
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
              onLoad={this.props.onLoad}
              colorTheme="#6E76FF"
              onError={(
                error,
                { currentUserAddr, addedMembers, members },
                showError
              ) => {
                console.log({ showError })
                if (
                  error &&
                  error.message &&
                  error.message.includes('not a member of the thread')
                ) {
                  if (members && !members.includes(currentUserAddr)) {
                    // user is not in the list of members
                    return 'You need to RSVP to get access'
                  } else if (
                    addedMembers &&
                    !addedMembers.includes(currentUserAddr)
                  ) {
                    // moderators haven't added user to the chat
                    return 'Request pending to add you to the chat'
                  }
                }
              }}
              popup
            />
          ) : (
            <NoParticipants />
          )}
        </ChatContainer>
      </Fragment>
    )
  }
}

export default Chat
