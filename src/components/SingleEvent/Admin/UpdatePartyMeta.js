import React, { Component } from 'react'

import PartyForm from './PartyForm'
import { UpdatePartyMeta } from '../../../graphql/mutations'
import { PartyQuery } from '../../../graphql/queries'
import ErrorBox from '../../ErrorBox'
import SafeQuery from '../../SafeQuery'

class UpdatePartyMetaComponent extends Component {
  render() {
    const { address } = this.props
    return (
      <SafeQuery
        query={PartyQuery}
        variables={{ address }}
        fetchPolicy="cache-and-network"
        pollInterval={60000}
      >
        {({ data: { party }, loading }) => {
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
          return (
            <PartyForm
              mutation={UpdatePartyMeta}
              name={party.name}
              type="Update Party Meta"
              address={address}
              description={party.description}
              location={party.location}
              date={party.date}
              image={party.image}
            />
          )
        }}
      </SafeQuery>
    )
  }
  _onCreated = ({ id }) => {}
}

export default UpdatePartyMetaComponent
