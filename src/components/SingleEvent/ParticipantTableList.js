import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'
import {
  PARTICIPANT_STATUS,
  calculateNumAttended,
  getSocialId
} from '@wearekickback/shared'

import {
  amAdmin,
  getMyParticipantEntry,
  calculateWinningShare,
  getParticipantsMarkedAttended,
  sortParticipants,
  filterParticipants
} from '../../utils/parties'
import { toEthVal } from '../../utils/units'
import { PARTY_ADMIN_VIEW_QUERY } from '../../graphql/queries'

import { Table, Tbody, TH, TR, TD } from '../Table'
import DefaultButton from '../Forms/Button'
import ErrorBox from '../ErrorBox'
import SafeQuery from '../SafeQuery'
import EventFilters from './EventFilters'
import { GlobalConsumer } from '../../GlobalState'
import Status from './ParticipantStatus'
import mq from '../../mediaQuery'
import MarkedAttended from './MarkedAttendedRP'
import tick from '../svg/tick.svg'
import Number from '../Icons/Number'

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
  { label: 'Real Name', value: 'user.realName' },
  { label: 'Address', value: 'user.address' },
  { label: 'Email' },
  { label: 'Twitter' }
]

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

function getTableCell(cell, i, participant) {
  const cells = {
    Email: <TD key={i}>{getEmail(participant.user.email)}</TD>,
    Twitter: <TD key={i}>{getSocialId(participant.user.social, 'twitter')}</TD>,
    Address: (
      <TD key={i} limit>
        {participant.user.address}
      </TD>
    )
  }

  if (cells[cell.label]) {
    return cells[cell.label]
  } else if (cell.hidden === true) {
    return null
  } else {
    return <TD key={i}>{_.get(participant, cell.value)}</TD>
  }
}

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

  downloadCSV(csv, filename) {
    let csvFile
    let downloadLink

    // CSV FILE
    csvFile = new Blob([csv], { type: 'text/csv' })

    // Download link
    downloadLink = document.createElement('a')

    // File name
    downloadLink.download = filename

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile)

    // Make sure that the link is not displayed
    downloadLink.style.display = 'none'

    // Add the link to your DOM
    document.body.appendChild(downloadLink)

    // Lanzamos
    downloadLink.click()
  }

  exportTableToCSV(html, filename) {
    var csv = []
    var rows = document.querySelectorAll('table tr')

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll('td, th')
      for (var j = 0; j < cols.length; j++) {
        if (cols[j].dataset.csv !== 'no') {
          row.push(cols[j].innerText)
        }
      }

      csv.push(row.join(','))
    }

    // Download CSV
    this.downloadCSV(csv.join('\n'), filename)
  }

  render() {
    const { search, selectedFilter } = this.state
    const { handleSearch, handleFilterChange } = this
    const { address } = this.props

    return (
      <SingleEventContainer>
        <GlobalConsumer>
          {({ userAddress }) => (
            <SafeQuery
              query={PARTY_ADMIN_VIEW_QUERY}
              variables={{ address }}
              fetchPolicy="cache-and-network"
              pollInterval={60000}
            >
              {({
                data: { partyAdminView: party },
                loading,
                error,
                refetch
              }) => {
                // no party?
                if (!party) {
                  if (loading) {
                    return 'Loading ...'
                  } else {
                    return (
                      <ErrorBox>
                        We could not find an event at the address {address}!
                      </ErrorBox>
                    )
                  }
                }
                const { participants, ended, deposit } = party

                // pre-calculate some stuff up here
                const preCalculatedProps = {
                  amAdmin: amAdmin(party, userAddress),
                  myParticipantEntry: getMyParticipantEntry(party, userAddress)
                }

                preCalculatedProps.amAdmin = amAdmin(party, userAddress)

                return (
                  <TableList>
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
                    </MarkedAttendedInfo>
                    {participants.length > 0 ? (
                      <>
                        <DownloadButton
                          type="hollow"
                          onClick={() => {
                            const html = document.querySelector('table')
                              .outerHTML
                            this.exportTableToCSV(html, 'event.csv')
                          }}
                        >
                          Download CSV
                        </DownloadButton>
                        <EventFilters
                          handleSearch={handleSearch}
                          handleFilterChange={handleFilterChange}
                          amAdmin={amAdmin}
                          search={search}
                          enableQrCodeScanner={amAdmin}
                          ended={ended}
                        />

                        <Table>
                          <Tbody>
                            <TR>
                              <TH data-csv="no">Status</TH>
                              {cells.map(
                                cell =>
                                  !cell.hidden && (
                                    <TH key={cell.label}>{cell.label}</TH>
                                  )
                              )}
                              <TH>Marketing</TH>
                            </TR>

                            {participants
                              .sort(sortParticipants)
                              .filter(
                                filterParticipants(selectedFilter, search)
                              )
                              .map(participant => {
                                const { status } = participant
                                const withdrawn =
                                  status === PARTICIPANT_STATUS.WITHDRAWN_PAYOUT
                                const attended =
                                  status === PARTICIPANT_STATUS.SHOWED_UP ||
                                  withdrawn

                                const numRegistered = party.participants.length
                                const numShowedUp = calculateNumAttended(
                                  party.participants
                                )

                                const payout = calculateWinningShare(
                                  deposit,
                                  numRegistered,
                                  numShowedUp
                                )
                                return (
                                  <TR key={participant.user.id}>
                                    <TD data-csv="no">
                                      {' '}
                                      {ended ? (
                                        attended ? (
                                          <Status type="won">{`${
                                            withdrawn ? ' Withdrew' : 'Won'
                                          } ${payout} ETH `}</Status>
                                        ) : (
                                          <Status type="lost">
                                            Lost{' '}
                                            {toEthVal(deposit)
                                              .toEth()
                                              .toString()}{' '}
                                            ETH
                                          </Status>
                                        )
                                      ) : (
                                        <>
                                          <MarkedAttended
                                            party={party}
                                            participant={participant}
                                            refetch={refetch}
                                          >
                                            {({
                                              markAttended,
                                              unmarkAttended
                                            }) =>
                                              attended ? (
                                                <Button
                                                  wide
                                                  onClick={() =>
                                                    unmarkAttended()
                                                  }
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
                                    {cells.map((cell, i) =>
                                      getTableCell(cell, i, participant)
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
