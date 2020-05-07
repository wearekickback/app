import React, { Component } from 'react'
import styled from '@emotion/styled'
import moment from 'moment'
import Chat from './Chat'
import { ReactTinyLink } from 'react-tiny-link'

import {
  amAdmin,
  getMyParticipantEntry,
  sortParticipants,
  filterParticipants
} from '../../utils/parties'
import { PARTY_QUERY } from '../../graphql/queries'

import { Table as DefaultTable, Tbody, TH, TR, TD } from '../Table'
import DefaultButton from '../Forms/Button'
import WarningBox from '../WarningBox'
import SafeQuery from '../SafeQuery'
import EventFilters from './EventFilters'
import { GlobalConsumer } from '../../GlobalState'
import mq from '../../mediaQuery'

const Table = styled(DefaultTable)`
  display: block;
  overflow-x: auto;
  white-space: nowrap;
`

const PRE = styled('pre')`
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  font-family: Courier, 'New Courier', monospace;
  background-color: #ececec;
  color: blue;
  padding: 1em;
`

const SingleEventContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  max-width: 100%;
  margin: 0 auto 0;
  flex-direction: column;
  ${mq.medium`
    flex-direction: row;
  `};
`

const Button = styled(DefaultButton)`
  display: flex;
`

const NoParticipants = styled('div')``

const TableList = styled('div')`
  display: flex;
  max-width: 100%;
  flex-direction: column;
`

const urlRegex = /(https?:\/\/[^ ]*)/

class SingleEventWrapper extends Component {
  state = {
    search: '',
    selectedFilter: null
  }

  handleSearch = value => {
    this.setState({
      search: value.toLowerCase()
    })
  }

  handleFilterChange = selectedFilter => {
    this.setState({ selectedFilter })
  }

  checkProgress = async () => {
    const chat = window.smart_chat
    let posts = await chat.getHistory()
    this.setState({ posts })
  }

  render() {
    const { search, selectedFilter, posts = [] } = this.state
    const { handleSearch, checkProgress } = this
    const { address, web3 } = this.props
    return (
      <SingleEventContainer>
        <GlobalConsumer>
          {({ userAddress }) => (
            <SafeQuery
              query={PARTY_QUERY}
              variables={{ address }}
              fetchPolicy="cache-and-network"
            >
              {({ data: { party }, loading, error, refetch }) => {
                // no party?
                if (!party) {
                  if (loading) {
                    return 'Loading ...'
                  } else {
                    return (
                      <WarningBox>
                        We could not find an event at the address {address}!
                      </WarningBox>
                    )
                  }
                }
                const { participants, ended } = party

                // pre-calculate some stuff up here
                const preCalculatedProps = {
                  amAdmin: amAdmin(party, userAddress),
                  myParticipantEntry: getMyParticipantEntry(party, userAddress)
                }
                console.log(JSON.stringify(party))
                preCalculatedProps.amAdmin = amAdmin(party, userAddress)
                return (
                  <TableList>
                    <p>
                      <h2>"{party.name}" challenge dashbaord</h2>
                      <h3>Command guide</h3>
                      If you have specific goal you want to achieve.
                      <>
                        <PRE>/setgoal GOAL DESCRIPTION</PRE>
                      </>
                      When you want to submit, post into our chat page with the
                      following format.
                      <>
                        <PRE>/submit HTTPS://PROOFURL NUMBER</PRE>
                      </>
                      "NUMBER" is required only if your challenge requires you
                      to record number (eg: number of pushups, km of jogging,
                      etc)
                    </p>

                    <Button onClick={() => checkProgress()}>Check Posts</Button>
                    {participants.length > 0 ? (
                      <>
                        <EventFilters
                          handleSearch={handleSearch}
                          search={search}
                          ended={ended}
                        />

                        <Table>
                          <Tbody>
                            <TR>
                              <TH>#</TH>
                              <TH>posts</TH>
                              <TH>User(Goal)</TH>
                              <TH>Last post</TH>
                            </TR>

                            {participants
                              .sort(sortParticipants)
                              .filter(
                                filterParticipants(selectedFilter, search)
                              )
                              .map(participant => {
                                let userGoal = ''
                                const userPost = posts.filter(post => {
                                  if (
                                    post.address === participant.user.address &&
                                    post.message.match(/\/setgoal/)
                                  ) {
                                    userGoal = post.message.replace(
                                      '/setgoal ',
                                      ''
                                    )
                                  }
                                  return (
                                    post.address === participant.user.address &&
                                    post.message.match(/\/submit/)
                                  )
                                })
                                let post = userPost[userPost.length - 1]
                                let date, message, url
                                if (post) {
                                  date = moment(
                                    new Date(post.timestamp * 1000)
                                  ).fromNow()

                                  message =
                                    post.message &&
                                    post.message.replace('/submit ', '')
                                  url = message.match(urlRegex)[1]
                                }

                                return (
                                  <TR key={participant.user.id}>
                                    <TD>{participant.index}</TD>
                                    <TD>{userPost.length}</TD>
                                    <TD>
                                      {participant.user.username}
                                      <br />
                                      {userGoal ? `(${userGoal})` : ''}
                                    </TD>
                                    <TD>
                                      {date}
                                      <br />
                                      {url ? (
                                        <ReactTinyLink
                                          cardSize="small"
                                          showGraphic={true}
                                          maxLine={2}
                                          minLine={1}
                                          url={url}
                                        />
                                      ) : (
                                        <span>{message}</span>
                                      )}
                                    </TD>
                                  </TR>
                                )
                              })}
                          </Tbody>
                        </Table>
                        <Chat
                          party={party}
                          web3={web3}
                          onLoad={() => {
                            checkProgress()
                          }}
                        />
                      </>
                    ) : (
                      <NoParticipants>No one is attending</NoParticipants>
                    )}
                  </TableList>
                )
              }}
            </SafeQuery>
          )}
        </GlobalConsumer>
      </SingleEventContainer>
    )
  }
}

export default SingleEventWrapper
