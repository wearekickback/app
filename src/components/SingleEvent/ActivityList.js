import React, { Component } from 'react'
import styled from '@emotion/styled'
import moment from 'moment'

import {
  amAdmin,
  getMyParticipantEntry,
  sortParticipants,
  filterParticipants
} from '../../utils/parties'
import { PARTY_QUERY } from '../../graphql/queries'

import { Table, Tbody, TH, TR, TD } from '../Table'
import DefaultButton from '../Forms/Button'
import WarningBox from '../WarningBox'
import SafeQuery from '../SafeQuery'
import EventFilters from './EventFilters'
import { GlobalConsumer } from '../../GlobalState'
import mq from '../../mediaQuery'

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

  checkProgress = async address => {
    const chat = window.smart_chat
    let posts = await chat.getHistory()
    this.setState({ posts })
  }

  render() {
    const { search, selectedFilter, posts = [] } = this.state
    const { handleSearch, checkProgress } = this
    const { address } = this.props
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

                preCalculatedProps.amAdmin = amAdmin(party, userAddress)
                return (
                  <TableList>
                    <h1>Kickback Challenge Dashboard</h1>
                    <h3>Sumission Rule</h3>
                    When you want to submit, post into our chat page with the
                    following format.
                    <>
                      <PRE>/submit HTTPS://PROOFURL</PRE>
                    </>
                    <Button onClick={() => checkProgress()}>
                      Check Submissions
                    </Button>
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
                              <TH>Submissions</TH>
                              <TH>Username</TH>
                            </TR>

                            {participants
                              .sort(sortParticipants)
                              .filter(
                                filterParticipants(selectedFilter, search)
                              )
                              .map(participant => {
                                const userPost = posts.filter(post => {
                                  return (
                                    post.address === participant.user.address &&
                                    post.message.match(/\/submit/)
                                  )
                                })
                                return (
                                  <TR key={participant.user.id}>
                                    <TD>{participant.index}</TD>
                                    <TD>{userPost.length}</TD>
                                    <TD>
                                      {participant.user.username}
                                      <ul>
                                        {userPost.map(post => {
                                          let date = moment(
                                            new Date(post.timestamp * 1000)
                                          ).format('MMMM Do YYYY, h:mm:ss a')
                                          console.log({ post })
                                          return (
                                            <li>
                                              {date} {post.message}
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    </TD>
                                  </TR>
                                )
                              })}
                          </Tbody>
                        </Table>
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
