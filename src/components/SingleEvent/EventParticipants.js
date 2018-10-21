import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'
import Participant from './Participant'
import EventFilters from './EventFilters'
import { ScanQRCode } from '../../graphql/mutations'
import { QRSupportedQuery } from '../../graphql/queries'
import SafeMutation from '../SafeMutation'
import SafeQuery from '../SafeQuery'

import { H3 } from '../Typography/Basic'
import { pluralize } from '../../utils/strings'

const EventParticipantsContainer = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 20px;
  margin-bottom: 40px;
`
const QRCodeContainer = styled('div')`
  margin-bottom: 20px;
`
const NoParticipants = styled('div')``

const Spots = styled('span')`
  font-size: 70%;
`

class EventParticipants extends Component {
  render() {
    const {
      handleSearch,
      setSearchTerm,
      searchTerm,
      party,
      party: { participants, participantLimit, ended },
      amAdmin
    } = this.props

    const lowerSearch = searchTerm.toLowerCase()

    participants.sort((a, b) => {
      return a.index < b.index ? -1 : 1
    })

    let spots

    if (ended) {
      spots = `${participants.length} out of ${participantLimit} attended`
    } else {
      const spotsLeft = participantLimit - participants.length
      spots = `${participants.length} going, ${spotsLeft} ${pluralize('spot', spotsLeft)} left`
    }

    return (
      <Fragment>
        <H3>Participants - <Spots>{spots}</Spots></H3>
        <EventFilters handleSearch={handleSearch} />
        {amAdmin? (
          <SafeQuery
                query={QRSupportedQuery}
                variables={{ address: '1' }}
              >
                {result => {
                  if (result.data.scanQRCodeSupported && result.data.scanQRCodeSupported.supported) {
                    return(
                      <SafeMutation mutation={ScanQRCode}>
                        {scanQRCode => (
                          <QRCodeContainer>
                            <Button 
                              onClick={ (() => {
                              scanQRCode().then((result)=>{
                                setSearchTerm(result.data.scanQRCode.address)
                              })
                            }) }>Scan QRCode</Button>
                          </QRCodeContainer>
                        )}  
                      </SafeMutation>          
                    )
                  } else {
                    return <QRCodeContainer>QRCode scanning not supported on your wallet. Try Status.im</QRCodeContainer>
                  }
                }}
          </SafeQuery>
        ) : null}
        <EventParticipantsContainer>
          { participants.length > 0 ? (
            participants
              .sort((a, b) => (a.index < b.index ? -1 : 1))
              .filter(p => (
                (p.user.realName || '').toLowerCase().includes(lowerSearch) ||
                (p.user.username || '').toLowerCase().includes(lowerSearch) || 
                (true && p.user.address.includes(lowerSearch))
              ))
              .map(participant => (
                <Participant
                  amAdmin={amAdmin}
                  participant={participant}
                  party={party}
                  key={`${participant.address}${participant.index}`}
                />
              ))
          ) : (
            <NoParticipants>No one is attending.</NoParticipants>
          )}
        </EventParticipantsContainer>
      </Fragment>
    )
  }
}

export default EventParticipants
