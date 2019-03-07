import React, { Component } from 'react'
import styled from 'react-emotion'
import { Route, Link } from 'react-router-dom'

import ParticipantTableList from './ParticipantTableList'
import AdminPanel from '../components/SingleEvent/Admin/AdminPanel'
import ErrorBox from '../components/ErrorBox'
import { PARTY_QUERY } from '../graphql/queries'
import { amAdmin } from '../utils/parties'
import SafeQuery from '../components/SafeQuery'
import { GlobalConsumer } from '../GlobalState'
import UpdatePartyMeta from '../components/SingleEvent/Admin/UpdatePartyMeta'

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

const BackToEventButton = styled(Link)`
  border: solid 1px #6e76ff;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  display: flex;
  transition: 0.2s;
  width: 250px;
  justify-content: center;
  align-items: center;

  img {
    margin-right: 10px;
    width: 20px;
  }

  &:hover {
    color: white;
    background: #6e76ff;
  }
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
            <>
              <BackToEventButton to={`/event/${address}`}>
                Back to Event Page
              </BackToEventButton>
              <SafeQuery
                query={PARTY_QUERY}
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
                        <ToggleLink
                          active={
                            pathname ===
                            `/event/${address}/admin/smart-contract`
                          }
                          to={`/event/${address}/admin/smart-contract`}
                        >
                          Smart Contract
                        </ToggleLink>
                      </TabNavigation>
                      <Route
                        path={`/event/${address}/admin`}
                        exact
                        render={() => (
                          <ParticipantTableList address={address} />
                        )}
                      />
                      <Route
                        path={`/event/${address}/admin/edit`}
                        exact
                        render={() => <UpdatePartyMeta address={address} />}
                      />
                      <Route
                        path={`/event/${address}/admin/smart-contract`}
                        exact
                        render={() => <AdminPanel party={party} />}
                      />
                    </>
                  )
                }}
              </SafeQuery>
            </>
          )
        }
      </GlobalConsumer>
    )
  }
}

export default SingleEvent
