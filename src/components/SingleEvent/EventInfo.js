import React, { Component } from 'react'
import styled from 'react-emotion'
import ReverseResolution from '../ReverseResolution'

const Date = styled('div')``
const EventName = styled('h2')``
const ContractAddress = styled('h3')``
const OrganiserImage = styled('img')``
const OrganiserName = styled('div')``
const Location = styled('div')``
const TotalPot = styled('div')``
const Tags = styled('section')``
const Tag = styled('div')``
const EventDescription = styled('p')``
const EventWarning = styled('div')``
const Photos = styled('section')``
const PhotoContainer = styled('div')``
const Photo = styled('img')``
const Comments = styled('section')``
const Comment = styled('div')``

class EventInfo extends Component {
  render() {
    const { party, address } = this.props
    console.log(party)
    return (
      <EventInfoContainer>
        <Date>{party.date}</Date>
        <EventName>{party.name}</EventName>
        <ContractAddress>{address}</ContractAddress>
        <OrganiserImage />
        <OrganiserName>
          <ReverseResolution address={party.owner} />
        </OrganiserName>
        <Location>{party.location}</Location>
        <TotalPot>
          Total pot {parseFloat(party.deposit) * parseInt(party.attendees, 10)}
        </TotalPot>
        <Tags>
          <Tag>Ethereum</Tag>
          <Tag>Fintech</Tag>
        </Tags>
        <EventDescription>Some description</EventDescription>
        <EventWarning />
        <Photos>
          <PhotoContainer>
            <Photo />
          </PhotoContainer>
        </Photos>
        <Comments>
          <Comment />
        </Comments>
      </EventInfoContainer>
    )
  }
}

const EventInfoContainer = styled('div')``

export default EventInfo
