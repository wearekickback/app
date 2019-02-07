import React, { Component } from 'react'
import styled from 'react-emotion'
import { Route, Link } from 'react-router-dom'

import ParticipantTableList from './ParticipantTableList'
import ErrorBox from '../components/ErrorBox'
import { PartyQuery } from '../graphql/queries'
import { amAdmin } from '../utils/parties'
import SafeQuery from '../components/SafeQuery'
import { GlobalConsumer } from '../GlobalState'
import SetLimit from '../components/SingleEvent/SetLimit'
import Clear from '../components/SingleEvent/Clear'
import UpdatePartyMeta from '../components/SingleEvent/Admin/UpdatePartyMeta'
import AddAdmin from '../components/SingleEvent/Admin/AddAdmin'

const AdminIntro = styled('p')`
  background-color: #ccc;
  padding: 1em;
  border-radius: 5px;
  color: #000;
`

const TabNavigation = styled('div')`
  margin-bottom: 20px;
  display: flex;
`

const ToggleLink = styled(Link)`
  padding: 20px 30px;
  display: flex;

  &:hover {
    color: white;
    background: #6e76ff;
  }

  ${p =>
    p.active &&
    `
    color: white;
    background: #6e76ff;
  `};
`

class SingleEvent extends Component {
  render() {
    const { address } = this.props.match.params
    const {
      location: { pathname }
    } = this.props
    return (
      <GlobalConsumer>
        {({ userAddress }) =>
          !userAddress ? (
            <ErrorBox>You need to be logged-in to view this page</ErrorBox>
          ) : (
            <SafeQuery
              query={PartyQuery}
              variables={{ address }}
              fetchPolicy="cache-and-network"
            >
              {({ data: { party } }) => {
                const isAdmin = amAdmin(party, userAddress)

                if (!isAdmin) {
                  return (
                    <ErrorBox>
                      You need to be an admin to view this page
                    </ErrorBox>
                  )
                }

                return (
                  <>
                    <TabNavigation>
                      <ToggleLink
                        active={pathname === `/event/${address}/admin`}
                        to={`/event/${address}/admin`}
                      >
                        Participants
                      </ToggleLink>
                      <ToggleLink
                        active={pathname === `/event/${address}/admin/edit`}
                        to={`/event/${address}/admin/edit`}
                      >
                        Edit Details
                      </ToggleLink>
                    </TabNavigation>
                    <Route
                      path={`/event/${address}/admin`}
                      exact
                      render={() => <ParticipantTableList address={address} />}
                    />
                    <Route
                      path={`/event/${address}/admin/edit`}
                      exact
                      render={() => (
                        <>
                          <UpdatePartyMeta address={address} />
                          <AdminIntro>
                            These are the administrative functions for this
                            event. Please be careful!
                          </AdminIntro>
                          <SetLimit address={address} />
                          <Clear address={address} />
                          <AddAdmin address={address} />
                        </>
                      )}
                    />
                  </>
                )
              }}
            </SafeQuery>
          )
        }
      </GlobalConsumer>
    )
  }
}

export default SingleEvent
