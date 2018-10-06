import React, { Component } from 'react'
import styled from 'react-emotion'
import { checkAdmin } from './utils'

import DefaultRSVP from './RSVP'
import { amAttendee } from '../../utils/attendees'
import { pluralize } from '../../utils/strings'
import { ATTENDEE_STATUS, sanitizeStatus } from '../../utils/status'
import { parseEthValue } from '../../utils/calculations'

const CTA = styled('div')`
  font-family: Overpass;
  font-weight: 500;
  font-size: 13px;
  color: #3d3f50;
  letter-spacing: 0;
  margin-bottom: 35px;
`
const RemainingSpots = styled('div')``
const RSVPContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`
const Deposit = styled('div')`
  font-family: Overpass;
  font-weight: 500;
  font-size: 13px;
  color: #6e76ff;
  letter-spacing: 0;
  text-align: center;
  line-height: 21px;
  padding: 10px 20px;
  width: 100px;
  background: rgba(233, 234, 255, 0.5);
  border-radius: 4px;
`

const Going = styled('div')`
  background-color: #6e76ff;
  border-radius: 4px;
  border: 1px solid #6e76ff;
  font-size: 14px;
  font-family: Muli;
  padding: 10px 20px;
  color: white;
  width: calc(100% - 120px);
  text-align: center;
`

const RSVP = styled(DefaultRSVP)`
  width: calc(100% - 120px);
`

const AdminCTA = styled('div')``

class EventCTA extends Component {
  _renderEnded() {
    const {
      userAddress,
      party: { attendees }
    } = this.props

    const went = amAttendee(attendees, userAddress)

    const cta = (
      <CTA>
        This meetup is past. {attendees.length} people registered to attend this
        event.
      </CTA>
    )

    if (!went) {
      return cta
    }

    switch (sanitizeStatus(went.status)) {
      case ATTENDEE_STATUS.REGISTERED:
        return <Going>You registered to attend but didn't show up.</Going>
      case ATTENDEE_STATUS.SHOWED_UP:
        return <Going>You attended!</Going>
      default:
        return cta
    }
  }

  _renderActive() {
    const {
      userAddress,
      party: { address, attendees, attendeeLimit }
    } = this.props

    const going = amAttendee(attendees, userAddress)

    if (!going) {
      if (attendees.length < attendeeLimit) {
        return <RSVP address={address} />
      }

      return ''
    }

    switch (sanitizeStatus(going.status)) {
      case ATTENDEE_STATUS.REGISTERED:
        return <Going>You are registered to attend this event.</Going>
      case ATTENDEE_STATUS.SHOWED_UP:
        return <Going>You showed up to this event!</Going>
      default:
        return ''
    }
  }

  render() {
    const {
      party: { attendees, attendeeLimit, deposit, ended }
    } = this.props

    let isAdmin = userAddress && party && checkAdmin(party, userAddress)

    return (
      <EventCTAContainer>
        <RSVPContainer>
          <Deposit>
            {parseEthValue(deposit)
              .toEth()
              .toFixed(2)}{' '}
            ETH
          </Deposit>
          {ended ? this._renderEnded() : this._renderActive()}
        </RSVPContainer>
        {ended ? (
          <CTA>This meetup is past. {attended} people went this event.</CTA>
        ) : (
          <CTA>Join the event.</CTA>
        )}
        {!ended && (
          <RemainingSpots>
            {`${attendees.length} going. ${pluralize(
              'spot',
              attendeeLimit - attendees.length
            )} left.`}
          </RemainingSpots>
        )}
        {isAdmin && <AdminCTA>I'm admin!</AdminCTA>}
      </EventCTAContainer>
    )
  }
}

const EventCTAContainer = styled('div')``

export default EventCTA
