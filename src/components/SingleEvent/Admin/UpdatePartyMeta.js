import React from 'react'

import { UPDATE_PARTY_META } from '../../../graphql/mutations'
import { PARTY_QUERY } from '../../../graphql/queries'

import Loader from '../../Loader'
import PartyForm from './PartyForm'
import ErrorBox from '../../ErrorBox'
import SafeQuery from '../../SafeQuery'

function UpdatePartyMetaComponent({ address }) {
  return (
    <SafeQuery
      query={PARTY_QUERY}
      variables={{ address }}
      fetchPolicy="cache-and-network"
      pollInterval={60000}
    >
      {({ data: { party }, loading }) => {
        // no party?
        if (!party) {
          if (loading) {
            return <Loader />
          } else {
            return (
              <ErrorBox>
                We could not find an event at the address {address}!
              </ErrorBox>
            )
          }
        }
        return (
          <>
            <PartyForm
              mutation={UPDATE_PARTY_META}
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
