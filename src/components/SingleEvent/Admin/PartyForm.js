import React, { Component } from 'react'
import styled from 'react-emotion'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'

import {
  getDayAndTimeFromDate,
  getDateFromDayAndTime
} from '../../../utils/parties'

import SafeMutation from '../../SafeMutation'
import Button from '../../Forms/Button'
import TextInput from '../../Forms/TextInput'
import TextArea from '../../Forms/TextArea'
import Label from '../../Forms/Label'
import { H2 } from '../../Typography/Basic'

const PartyFormContainer = styled('div')``
const PartyFormContent = styled('div')``

class PartyForm extends Component {
  constructor(props) {
    super(props)
    const {
      name = '',
      description = '',
      location = '',
      date = `${new Date().getTime()}`,
      image = '',
      deposit = '0.02',
      coolingPeriod = `${60 * 60 * 24 * 7}`,
      limitOfParticipants = 20
    } = props

    const [day, time] = getDayAndTimeFromDate(date)

    this.state = {
      name,
      description,
      location,
      day: new Date(day),
      time,
      image,
      deposit,
      coolingPeriod,
      limitOfParticipants
    }
  }

  render() {
    const {
      name,
      description,
      location,
      day,
      time,
      image,
      deposit,
      limitOfParticipants,
      coolingPeriod
    } = this.state

    const {
      type = 'Create Pending Party',
      onCompleted,
      mutation,
      address,
      children,
      variables: extraVariables = {}
    } = this.props

    const date = `${getDateFromDayAndTime(day, time)}`

    const variables = {
      meta: { name, description, location, date, image },
      ...extraVariables
    }

    if (type === 'Update Party Meta') {
      variables.address = address
    }

    return (
      <PartyFormContainer>
        <H2>Event Details</H2>
        <PartyFormContent>
          <Label>Event Name</Label>
          <TextInput
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
            type="text"
            placeholder="Name of the event"
          />
          <Label>Description</Label>
          <TextArea
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="Description of the event"
          >
            {description}
          </TextArea>
          <Label>Location</Label>
          <TextInput
            value={location}
            onChange={e => this.setState({ location: e.target.value })}
            type="text"
            placeholder="Location of the event"
          />
          <Label>Date</Label>
          <DayPickerInput
            value={day}
            onDayChange={day => this.setState({ day })}
          />
          <Label>Time</Label>
          <TextInput
            value={time}
            onChange={e => this.setState({ time: e.target.value })}
            type="text"
            placeholder="Time"
          />
          <Label>Image</Label>
          <TextInput
            value={image}
            onChange={e => this.setState({ image: e.target.value })}
            type="text"
            placeholder="URL to image for the event"
          />
          {type === 'Create Pending Party' && (
            <>
              <Label>Commitment</Label>
              <TextInput
                value={deposit}
                onChange={e => this.setState({ deposit: e.target.value })}
                type="text"
                placeholder="ETH"
              />
              <Label>Limit of participants</Label>
              <TextInput
                value={limitOfParticipants}
                onChange={e =>
                  this.setState({
                    limitOfParticipants: e.target.value
                  })
                }
                type="text"
                placeholder="number of participants"
              />
              <Label>Cooling period</Label>
              <TextInput
                value={coolingPeriod}
                onChange={e =>
                  this.setState({
                    coolingPeriod:
                      0 < parseInt(e.target.value) ? e.target.value : '1'
                  })
                }
                type="text"
                placeholder="Cooling period in seconds"
              />
            </>
          )}
        </PartyFormContent>

        {children}

        <SafeMutation
          mutation={mutation}
          resultKey="id"
          variables={variables}
          onCompleted={
            onCompleted
              ? ({ id }) =>
                  onCompleted(
                    { id },
                    deposit,
                    limitOfParticipants,
                    coolingPeriod
                  )
              : null
          }
        >
          {mutate => (
            <Button onClick={mutate} analyticsId={type}>
              {type}
            </Button>
          )}
        </SafeMutation>
      </PartyFormContainer>
    )
  }
}

export default PartyForm
