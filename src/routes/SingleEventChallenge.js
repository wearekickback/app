import React, { Component } from 'react'
import styled from '@emotion/styled'
import mq from '../mediaQuery'
import { Route, Link } from 'react-router-dom'
import { ReactComponent as DefaultBackArrow } from '../components/svg/arrowBack.svg'

import ActivityList from '../components/SingleEvent/ActivityList'
import WarningBox from '../components/WarningBox'
import { PARTY_QUERY } from '../graphql/queries'
import SafeQuery from '../components/SafeQuery'
import { GlobalConsumer } from '../GlobalState'
import colours from '../colours'
import { getPartyImageLarge } from '../utils/parties'
import Chat from '../components/SingleEvent/Chat'

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
        {({ userAddress, web3 }) =>
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
                  party.headerImg = getPartyImageLarge(party.headerImg)
                  return (
                    <SingleEventAdminContainer>
                      <TabNavigation>
                        <ToggleLink
                          active={pathname === `/event/${address}/challenge`}
                          to={`/event/${address}/challenge`}
                        >
                          Dashboard
                        </ToggleLink>
                      </TabNavigation>
                      <TabContent>
                        <Route
                          path={`/event/${address}/challenge`}
                          exact
                          render={() => <ActivityList address={address} />}
                        />
                      </TabContent>
                      <Chat party={party} web3={web3} />
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
