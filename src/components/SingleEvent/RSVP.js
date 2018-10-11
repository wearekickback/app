import React from 'react'

import { PartyQuery } from '../../graphql/queries'
import ChainMutation from '../ChainMutation'
import Button from '../Forms/Button'
import { RsvpToEvent } from '../../graphql/mutations'

const RSVP = ({ address, className }) => (
  <ChainMutation
    mutation={RsvpToEvent}
    resultKey="rsvp"
    variables={{ address }}
    refetchQueries={[{ query: PartyQuery, variables: { address } }]}
  >
    {(rsvp, result) => {
      const { data, loading, error } = result
      const { tx, percentComplete } = data
      let content

      if (error) {
        content = <div>{`${error}`}</div>
      } else if (loading) {
        content = (
          <div>
            Awaiting confirmation ({percentComplete}
            %)
          </div>
        )
      } else if (!loading && tx) {
        content = <div>RSVPed!</div>
      } else {
        content = 'RSVP'
      }

      return (
        <Button onClick={rsvp} className={className}>
          {content}
        </Button>
      )
    }}
  </ChainMutation>
)

export default RSVP
