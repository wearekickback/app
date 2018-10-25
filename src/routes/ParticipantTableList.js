import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'react-emotion'
import { addressesMatch } from '@noblocknoparty/shared'

import { amInAddressList } from '../utils/parties'
import { PartyVerboseQuery } from '../graphql/queries'

import { Table, Tbody, TH, TR, TD } from '../components/Table'
import ErrorBox from '../components/ErrorBox'
import SafeQuery from '../components/SafeQuery'
import EventFilters from '../components/SingleEvent/EventFilters'
import { GlobalConsumer } from '../GlobalState'
import mq from '../mediaQuery'

const SingleEventContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto 0;
  flex-direction: column;
  ${mq.medium`
    flex-direction: row;
  `};
`

const NoParticipants = styled('div')``

const TableList = styled('div')`
  display: flex;
  flex-direction: column;
`

const cells = [
  { label: 'Real Name', value: 'realName' },
  { label: 'Address', value: 'address' },
  { label: 'Email', value: 'email' }
]

class SingleEventWrapper extends Component {
  state = {
    search: ''
  }

  handleSearch = event => {
    this.setState({
      search: event.target.value
    })
  }

  render() {
    const { search } = this.state
    const { handleSearch } = this
    const { address } = this.props.match.params

    return (
      <SingleEventContainer>
        <GlobalConsumer>
          {({ userAddress }) => (
            <SafeQuery
              query={PartyVerboseQuery}
              variables={{ address }}
              fetchPolicy="cache-and-network"
              pollInterval={60000}
            >
              {({ data: { partyVerbose: party }, loading, error }) => {
                // no party?
                console.log(error)
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
                const { participants } = party

                // pre-calculate some stuff up here
                const preCalculatedProps = {
                  amOwner: addressesMatch(
                    _.get(party, 'owner.address', ''),
                    userAddress
                  ),
                  myParticipantEntry:
                    userAddress &&
                    _.get(party, 'participants', []).find(a =>
                      addressesMatch(_.get(a, 'user.address', ''), userAddress)
                    )
                }

                preCalculatedProps.amAdmin =
                  preCalculatedProps.amOwner ||
                  (userAddress &&
                    amInAddressList(
                      _.get(party, 'admins', []).map(a => a.address),
                      userAddress
                    ))

                return (
                  <TableList>
                    <EventFilters handleSearch={handleSearch} />
                    <Table>
                      <Tbody>
                        <TR>
                          {cells.map(cell => (
                            <TH>{cell.label}</TH>
                          ))}
                          <TH>GDPR</TH>
                          <TH>Marketing</TH>
                        </TR>

                        {participants.length > 0 ? (
                          participants
                            .sort((a, b) => (a.index < b.index ? -1 : 1))
                            .filter(
                              p =>
                                (p.user.realName || '')
                                  .toLowerCase()
                                  .includes(search) ||
                                (p.user.username || '')
                                  .toLowerCase()
                                  .includes(search)
                            )
                            .map(participant => (
                              <>
                                <TR />
                                <TR>
                                  {cells.map(cell => {
                                    if (cell.value === 'email') {
                                      return (
                                        <TD>
                                          {participant.user.email.verified
                                            ? participant.user.email.verified
                                            : participant.user.email.pending}
                                        </TD>
                                      )
                                    }
                                    return (
                                      <TD>{participant.user[cell.value]}</TD>
                                    )
                                  })}
                                  <TD>
                                    {participant.user.legal &&
                                    participant.user.legal[0].accepted.length >
                                      0
                                      ? 'accepted'
                                      : 'denied'}
                                  </TD>
                                  <TD>
                                    {participant.user.legal[2] &&
                                    participant.user.legal[2].accepted.length >
                                      0
                                      ? 'accepted'
                                      : 'denied'}
                                  </TD>
                                </TR>
                              </>
                            ))
                        ) : (
                          <NoParticipants>No one is attending.</NoParticipants>
                        )}
                      </Tbody>
                    </Table>
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
