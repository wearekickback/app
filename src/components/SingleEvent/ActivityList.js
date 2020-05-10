import React, { useState } from 'react'
import styled from '@emotion/styled'
import moment from 'moment'
import Chat from './Chat'
import { ReactTinyLink } from 'react-tiny-link'
import _ from 'lodash'
import { sortParticipants, filterParticipants } from '../../utils/parties'

import {
  Table as DefaultTable,
  Tbody,
  TH as DefaultTH,
  TR,
  TD as DefaultTD
} from '../Table'
import DefaultButton from '../Forms/Button'
import WarningBox from '../WarningBox'
import EventFilters from './EventFilters'

const Table = styled(DefaultTable)`
  display: block;
  overflow-x: auto;
  table-layout: fixed;
`

const TH = styled(DefaultTH)``

const TD = styled(DefaultTD)``

const FirstTH = styled(DefaultTH)`
  width: 1em;
  word-wrap: break-word;
`

const SecondTH = styled(DefaultTH)`
  width: 30%;
  word-wrap: break-word;
`

const UL = styled('ul')`
  list-style: none;
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
const today = moment().format('DDMM')
const yesterday = moment()
  .subtract(1, 'd')
  .format('DDMM')
let counter = 0

function ActivityList({ address, web3, party }) {
  let todayEntries = []
  let yesterdayEntries = []

  counter = counter + 1
  const [search, setSearch] = useState('')
  const [selectedFilter] = useState(null)
  const [posts, setPosts] = useState(null)

  const handleSearch = value => {
    setSearch(value.toLowerCase())
  }

  const checkProgress = async messages => {
    if (messages) {
      setPosts(messages)
    } else {
      setPosts(await window.smart_chat.getHistory())
    }
  }

  if (!party) {
    return (
      <WarningBox>
        We could not find an event at the address {address}!
      </WarningBox>
    )
  }
  const { participants, ended } = party
  if (participants.length === 0) {
    return <NoParticipants>No one is attending</NoParticipants>
  }
  const participantNames = participants.map(p => p.user.username)
  const startDay = moment(party.start)

  const participantsToRender = participants
    .sort(sortParticipants)
    .filter(filterParticipants(selectedFilter, search))
    .map(participant => {
      let userGoal = ''
      const userPost = posts
        ? posts.filter(post => {
            let postDate = moment(new Date(post.timestamp * 1000))
            if (
              post.address === participant.user.address &&
              post.message.match(/^\/setgoal/)
            ) {
              userGoal = post.message.replace('/setgoal ', '')
            }
            if (!moment().isBefore(startDay) && postDate.isBefore(startDay))
              return false

            return (
              post.address === participant.user.address &&
              post.message.match(/^\/submit/)
            )
          })
        : []
      let post = userPost[userPost.length - 1]
      let counts = userPost.map(p => {
        let matched = p.message.match(/ \d+/)
        if (matched) {
          return parseInt(matched[0])
        } else {
          return 0
        }
      })

      let updatedAt, message, url
      if (post) {
        updatedAt = moment(new Date(post.timestamp * 1000))
        message = post.message && post.message.replace('/submit ', '')
        url = message.match(urlRegex) && message.match(urlRegex)[1]
      }

      let groupByDate = _.groupBy(userPost, p =>
        moment(new Date(p.timestamp * 1000)).format('DDMM')
      )
      if (groupByDate[today]) {
        todayEntries.push(participant.user.username)
      }
      if (groupByDate[yesterday]) {
        yesterdayEntries.push(participant.user.username)
      }

      let dayCount = Object.keys(groupByDate).length
      let obj = {
        participant,
        userGoal,
        userPost,
        dayCount,
        counts,
        updatedAt,
        url,
        message
      }
      return obj
    })
  if (participantsToRender.length === 0) {
    return <NoParticipants>Waiting for submissions</NoParticipants>
  }
  const todayMissing =
    todayEntries.length > 0
      ? _.xor(todayEntries, participantNames).join(', ')
      : ''
  const yesterdayMissing =
    yesterdayEntries.length > 0
      ? _.xor(yesterdayEntries, participantNames).join(', ')
      : ''
  return (
    <>
      <TableList>
        <p>
          <h2>"{party.name}" challenge dashbaord</h2>
          <h3>Command guide</h3>
          If you have specific goal you want to achieve.
          <>
            <PRE>/setgoal GOAL DESCRIPTION</PRE>
          </>
          When you want to submit, post into our chat page with the following
          format.
          <>
            <PRE>/submit HTTPS://PROOFURL COUNT</PRE>
          </>
          "COUNT" is required only if your challenge requires you to count (eg:
          number of pushups, km of jogging, etc)
        </p>
        <h3>Daily summary</h3>
        <h4>Today</h4>
        {todayEntries.length} missing ({todayMissing})<h4>Yesterday</h4>
        {yesterdayEntries.length} missing ({yesterdayMissing})
        <Button onClick={() => checkProgress()}>Check Posts</Button>
        <EventFilters
          handleSearch={handleSearch}
          search={search}
          ended={ended}
        />
        <span>
          (n)ame, (g)oal, number of (s)ubmissions, number of (d)ays submitted,
          total (c)ounts
        </span>
        <Table>
          <Tbody>
            <TR>
              <FirstTH>#</FirstTH>
              <SecondTH>Summary</SecondTH>
              <TH>Last post</TH>
            </TR>
            {participantsToRender.map(
              ({
                participant,
                userGoal,
                userPost,
                dayCount,
                counts,
                updatedAt,
                url,
                message
              }) => {
                return (
                  <TR
                    key={participant && participant.user && participant.user.id}
                  >
                    <TD>{participant && participant.index}</TD>
                    <TD>
                      <UL>
                        <li>
                          n:{' '}
                          {participant &&
                            participant.user &&
                            participant.user.username}
                        </li>
                        {userGoal ? <li>g: {userGoal}</li> : ''}
                        <li>s: {`${userPost && userPost.length} times`} </li>
                        <li>d: {`${dayCount} days`} </li>
                        <li>c: {_.sum(counts)} </li>
                      </UL>
                    </TD>
                    <TD>
                      {updatedAt && updatedAt.fromNow()}
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
              }
            )}
          </Tbody>
        </Table>
        <Chat
          party={party}
          web3={web3}
          onLoad={() => {
            checkProgress()
          }}
        />
      </TableList>
    </>
  )
}

export default ActivityList
