import React, { Component } from 'react'
import styled from '@emotion/styled'
import mq from '../mediaQuery'
import { Route, Link } from 'react-router-dom'
import { ReactComponent as DefaultBackArrow } from '../components/svg/arrowBack.svg'

import ParticipantTableList from '../components/SingleEvent/ParticipantTableList'
import CheckIn from '../components/SingleEvent/Admin/CheckIn'
import SmartContractFunctions from '../components/SingleEvent/Admin/SmartContractFunctions'
import WarningBox from '../components/WarningBox'
import { PARTY_QUERY } from '../graphql/queries'
import { amAdmin } from '../utils/parties'
import SafeQuery from '../components/SafeQuery'
import { GlobalConsumer } from '../GlobalState'
import EventEdit from '../components/SingleEvent/Admin/EventEdit'
import colours from '../colours'

const { primary500, primary400, primary300, primary200 } = colours

const SingleEventAdminContainer = styled('div')`
  position: relative;
`

const TabContent = styled('div')`
  position: relative;
  left: 0;
  ${mq.medium`
    max-width: calc(100% - 200px);
    left: 200px;
  `}
`

const TabNavigation = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  ${mq.medium`
    justify-content: flex-start;
    position: absolute;
    flex-direction: column;
    left: 0;
    top: 0;
  `}
`

const ToggleLink = styled(Link)`
  display: flex;
  transition: 0.2s;
  color: ${primary200};
  padding-right: 20px;
  font-size: 16px;

  ${mq.medium`
    margin-bottom: 30px;
  `}

  &:hover {
    color: ${primary500};
  }

  ${p =>
    p.active &&
    `
    color: #6e76ff;;
  `};
`

const BackToEventButton = styled(Link)`
  color: ${primary400};
  padding: 10px 20px 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 12px;
  margin-bottom: 20px;
  border-radius: 10px;
  display: flex;
  transition: 0.2s;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    color: ${primary500};
    text-decoration: underline;

    path {
      fill: ${primary400};
    }
  }
`

const BackArrow = styled(DefaultBackArrow)`
  path {
    fill: ${primary300};
  }
  width: 20px;
  margin-top: 4px;
  margin-right: 10px;
  margin-left: -4px;
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
            <WarningBox>You need to be logged-in to view this page</WarningBox>
          ) : (
            <>
              <BackToEventButton to={`/event/${address}`}>
                <BackArrow /> Back to Event
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
                      <>
                        <WarningBox>
                          You need to be an admin to view this page
                        </WarningBox>
                        <SmartContractFunctions
                          party={party}
                          isAdmin={isAdmin}
                        />
                      </>
                    )
                  }
                  return (
                    <SingleEventAdminContainer>
                      <TabNavigation>
                        <ToggleLink
                          active={pathname === `/event/${address}/admin`}
                          to={`/event/${address}/admin`}
                        >
                          Participants
                        </ToggleLink>
                        <ToggleLink
                          active={
                            pathname === `/event/${address}/admin/checkin`
                          }
                          to={`/event/${address}/admin/checkin`}
                        >
                          POAP Check in
                        </ToggleLink>
                        <ToggleLink
                          active={pathname === `/event/${address}/admin/edit`}
                          to={`/event/${address}/admin/edit`}
                        >
                          Event Details
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
                      <TabContent>
                        <Route
                          path={`/event/${address}/admin`}
                          exact
                          render={() => (
                            <ParticipantTableList address={address} />
                          )}
                        />
                        <Route
                          path={`/event/${address}/admin/checkin`}
                          exact
                          render={() => <CheckIn party={party} />}
                        />
                        <Route
                          path={`/event/${address}/admin/edit`}
                          exact
                          render={() => <EventEdit address={address} />}
                        />
                        <Route
                          path={`/event/${address}/admin/smart-contract`}
                          exact
                          render={() => (
                            <SmartContractFunctions party={party} />
                          )}
                        />
                      </TabContent>
                    </SingleEventAdminContainer>
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
