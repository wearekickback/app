import React from 'react'

import { UPDATE_EVENT_META } from '../../../graphql/mutations'
import { PARTY_QUERY } from '../../../graphql/queries'

import Loader from '../../Loader'
import PartyForm from './PartyForm'
import WarningBox from '../../WarningBox'
import SafeQuery from '../../SafeQuery'

function UpdatePartyMetaComponent({ address }) {
  return (
    <SafeQuery
      query={PARTY_QUERY}
      variables={{ address }}
      fetchPolicy="cache-and-network"
    >
      {({ data: { party }, loading }) => {
        // no party?
        if (!party) {
          if (loading) {
            return <Loader />
          } else {
            return (
              <WarningBox>
                We could not find an event at the address {address}!
              </WarningBox>
            )
          }
        }
        return (
          <>
            <PartyForm
              mutation={UPDATE_EVENT_META}
              name={party.name}
              type="edit"
              address={address}
              {...party}
            />
          </>
        )
      }}
    </SafeQuery>
  )
}

export default UpdatePartyMetaComponent
