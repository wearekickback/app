import _, { set } from 'lodash'
import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'

import styled from '@emotion/styled'
import { PARTICIPANT_STATUS, getSocialId } from '@wearekickback/shared'
import {
  amAdmin,
  getParticipantsMarkedAttended,
  sortParticipants,
  filterParticipants
} from '../../utils/parties'

import { Table, Tbody, TH, TR, TD } from '../Table'
import DefaultButton from '../Forms/Button'
import EventFilters from './EventFilters'
import MarkedAttended from './MarkedAttendedRP'
import tick from '../svg/tick.svg'
import Number from '../Icons/Number'
import { POAP_EVENT_NAME_QUERY } from '../../graphql/queries'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { fetchAndSetPoapAddresses } from './utils'
const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai'
})

const Mismatched = styled('span')`
  color: orange;
`

const Button = styled(DefaultButton)`
  display: flex;
`

const NoParticipants = styled('div')``

const TableListContainer = styled('div')`
  display: flex;
  max-width: 100%;
  flex-direction: column;
`

const TickContainer = styled('div')`
  width: 12px;
  margin-left: 3px;
`

const MarkedAttendedInfo = styled('div')`
  margin-bottom: 20px;

  p {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
    color: #2b2b2b;
    letter-spacing: 0.04em;
    margin-top: 0;
    margin-bottom: 20px;
  }
`

const Tick = () => (
  <TickContainer>
    <img alt="tick" src={tick} />
  </TickContainer>
)

const DownloadButton = styled(Button)`
  margin-bottom: 20px;
  max-width: 200px;
  position: absolute;
  right: 0;
  top: 0;
`

const cells = [
  { label: 'Username', value: 'user.username' },
  { label: 'Twitter' },
  { label: 'Real Name', value: 'user.realName', private: true },
  { label: 'Address', value: 'user.address', private: true },
  { label: 'Email', private: true }
]

function getStatus(ended, attended, withdrawn) {
  if (ended) {
    if (attended) {
      if (withdrawn) {
        return 'Withdrawn'
      } else {
        return 'Won'
      }
    } else {
      return 'Lost'
    }
  } else {
    if (attended) {
      return 'Attended'
    } else {
      return 'RSPV'
    }
  }
}

function getEmail(email) {
  if (email === null) {
    return null
  }

  if (email.verified) {
    return email.verified
  } else if (email.pending) {
    return email.pending
  } else {
    return null
  }
}

function getTableCell(cell, i, participant, displayPrivateInfo) {
  const cells = {
    Email: <TD key={i}>{getEmail(participant.user.email)}</TD>,
    Twitter: <TD key={i}>{getSocialId(participant.user.social, 'twitter')}</TD>,
    Address: (
      <TD key={i} limit>
        {participant.user.address}
      </TD>
    )
  }
  if (cell.private && !displayPrivateInfo) return null
  if (cells[cell.label]) {
    return cells[cell.label]
  } else if (cell.hidden === true) {
    return null
  } else {
    return <TD key={i}>{_.get(participant, cell.value)}</TD>
  }
}

const TableList = ({
  participants,
  lastParticipant,
  handleSearch,
  handleFilterChange,
  search,
  ended,
  selectedFilter,
  party,
  refetch,
  handleCheckBox,
  displayPrivateInfo,
  exportTableToCSV
}) => {
  const [poapAddresses, setPoapAddresses] = useState({})
  const poapHolderAddresses = {}
  const poapIds =
    party.optional &&
    party.optional.poapId &&
    party.optional.poapId.split(',').map(p => p.trim())
  // const { data: poapEventName } = useQuery(POAP_EVENT_NAME_QUERY, {
  //   variables: { eventId: parseInt(poapId) },
  //   skip: !poapId
  // })
  // console.log('***', { poapId, poapEventName })
  // const poapImage =
  //   poapEventName &&
  //   poapEventName.poapEventName &&
  //   poapEventName.poapEventName.image_url

  useEffect(() => {
    fetchAndSetPoapAddresses(setPoapAddresses, poapIds)
  }, [])

  const filtered = participants
    .sort(sortParticipants)
    .filter(filterParticipants(selectedFilter, search))

  filtered.map(participant => {
    if (poapAddresses[participant.user.address]) {
      poapHolderAddresses[participant.user.address] = true
    }
  })

  return (
    <TableListContainer>
      <MarkedAttendedInfo>
        <p>Marked attended:</p>
        <Number
          number={getParticipantsMarkedAttended(participants)}
          max={participants.length}
          progress={
            (getParticipantsMarkedAttended(participants) /
              participants.length) *
            100
          }
        />
        {!lastParticipant ||
        participants.length === lastParticipant.index ? null : (
          <Mismatched>
            The total participants ({participants.length}) does not match with
            participant index ({lastParticipant.index}). May have missing
            participant info due to reorg.
          </Mismatched>
        )}
      </MarkedAttendedInfo>
      {participants.length > 0 ? (
        <>
          <DownloadButton
            type="hollow"
            onClick={() => {
              const html = document.querySelector('table').outerHTML
              exportTableToCSV(html, 'event.csv')
            }}
          >
            Download CSV
          </DownloadButton>
          <EventFilters
            handleSearch={handleSearch}
            handleFilterChange={handleFilterChange}
            amAdmin={amAdmin}
            search={search}
            // enableQrCodeScanner={amAdmin}
            ended={ended}
          />
          <div>
            <label class="container">
              Show private info
              <input type="checkbox" onClick={handleCheckBox} />
              <span class="checkmark"></span>
            </label>
          </div>
          <Table>
            <Tbody>
              <TR>
                <TH>#</TH>
                {participants[0].user.whiteList && (
                  <TH>${participants[0].user.whiteList.symbol}</TH>
                )}
                {poapIds && poapAddresses && (
                  <TH>
                    POAP({Object.keys(poapHolderAddresses).length}/{' '}
                    {Object.keys(poapAddresses).length})
                  </TH>
                )}
                <TH>Action</TH>
                <TH>Status</TH>
                {cells.map(
                  cell =>
                    ((cell.private && displayPrivateInfo) || !cell.private) && (
                      <TH key={cell.label}>{cell.label}</TH>
                    )
                )}
                <TH>Marketing</TH>
              </TR>
              {filtered.map(participant => {
                const { status } = participant
                const withdrawn = status === PARTICIPANT_STATUS.WITHDRAWN_PAYOUT
                const attended =
                  status === PARTICIPANT_STATUS.SHOWED_UP || withdrawn

                return (
                  <TR key={participant.user.id}>
                    <TD>{participant.index}</TD>
                    {participant.user.whiteList && (
                      <TD>{participant.user.whiteList.balance}</TD>
                    )}
                    {poapIds && Object.keys(poapAddresses).length > 0 && (
                      <TD>
                        {poapAddresses[participant.user.address] &&
                          Object.entries(
                            poapAddresses[participant.user.address]
                          ).map(row => {
                            const [poapId, tokenId] = row
                            return (
                              <>
                                {poapId}:
                                <a
                                  href={`https://app.poap.xyz/token/${tokenId}`}
                                >
                                  {tokenId}{' '}
                                </a>
                              </>
                            )
                          })}
                      </TD>
                    )}

                    <TD data-csv="no">
                      {' '}
                      {ended ? (
                        ''
                      ) : (
                        <>
                          <MarkedAttended
                            party={party}
                            participant={participant}
                            refetch={refetch}
                          >
                            {({ markAttended, unmarkAttended }) =>
                              attended ? (
                                <Button
                                  wide
                                  onClick={() => unmarkAttended()}
                                  analyticsId="Unmark Attendee"
                                >
                                  Unmark attended
                                </Button>
                              ) : (
                                <Button
                                  wide
                                  type="hollow"
                                  onClick={() => markAttended()}
                                  analyticsId="Mark Attendee"
                                >
                                  Mark attended <Tick />
                                </Button>
                              )
                            }
                          </MarkedAttended>
                        </>
                      )}
                    </TD>
                    <TD>{getStatus(ended, attended, withdrawn)}</TD>
                    {cells.map((cell, i) =>
                      getTableCell(cell, i, participant, displayPrivateInfo)
                    )}
                    <TD>
                      {participant.user.legal &&
                      participant.user.legal[2] &&
                      participant.user.legal[2].accepted
                        ? 'accepted'
                        : 'denied'}
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
    </TableListContainer>
  )
}

export default TableList
