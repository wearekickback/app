import React, { Component } from 'react'
import styled from 'react-emotion'

import ErrorBox from '../components/ErrorBox'
import { PartyAdminsQuery } from '../graphql/queries'
import { amOwner, amAdmin } from '../utils/parties'
import SafeQuery from '../components/SafeQuery'
import { GlobalConsumer } from '../GlobalState'
import SingleEventWrapper from '../components/SingleEvent/SingleEventWrapper'
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

const Separator = styled('hr')`
  border-width: 3px;
  margin: 20px 0;
`

class SingleEvent extends Component {
  render() {
    const { address } = this.props.match.params
    return (
      <GlobalConsumer>
        {({ userAddress }) =>
          !userAddress ? (
            <ErrorBox>You need to be logged-in to view this page</ErrorBox>
          ) : (
            <SafeQuery
              query={PartyAdminsQuery}
              variables={{ address }}
              fetchPolicy="cache-and-network"
            >
              {({ data: { party } }) => {
                const isOwner = amOwner(party, userAddress)
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
                    <AdminIntro>
                      These are the administrative functions for this event.
                      Please be careful!
                    </AdminIntro>
                    <SetLimit address={address} />
                    <Clear address={address} />
                    <UpdatePartyMeta address={address} />
                    {isOwner ? <AddAdmin address={address} /> : null}
                    <Separator />
                    <SingleEventWrapper address={address} />
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
