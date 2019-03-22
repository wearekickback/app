import React, { Component } from 'react'
import styled from 'react-emotion'
import Dropzone from 'react-dropzone'
import { Mutation } from 'react-apollo'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import TimezonePicker, { timezones } from 'react-timezone'

import {
  getDayAndTimeFromDate,
  getDateFromDayAndTime,
  getLocalTimezoneOffset
} from '../../../utils/dates'

import { SINGLE_UPLOAD } from '../../../graphql/mutations'

import SafeMutation from '../../SafeMutation'
import Button from '../../Forms/Button'
import TextInput from '../../Forms/TextInput'
import TextArea from '../../Forms/TextArea'
import Label from '../../Forms/Label'
import { H2 } from '../../Typography/Basic'

const PartyFormContainer = styled('div')`
  max-width: 768px;
`
const PartyFormContent = styled('div')``

const InputWrapper = styled('div')`
  margin-bottom: 20px;
`

const primary2 = `hsla(237, 75%, 72%, 1)`

const NoImage = styled('div')`
  color: white;
  background: ${primary2};
  max-width: 100%;
  height: 300px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 6px;
  box-shadow: 0 2px 0 hsla(0, 0%, 100%, 0.15)

  &:hover {
    cursor: pointer;
  }
`

const ImageWrapper = styled('div')`
  display: flex;
  border-radius: 6px;

  &:before {
    content: "${p => p.text}";
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: 0.2s;
    position: absolute;
    left: 0;
    top: 0;
    color: white;
    width: 100%;
    height: 100%;
    background: rgba(110, 118, 255, 0.85);
    box-shadow: 0 2px 0 hsla(0, 0%, 100%, 0.15)
  }
  &:hover {
    cursor: pointer;
    &:before {
      opacity: 1;
    }
  }
`

const DropZoneWrapper = styled('div')`
  margin-bottom: 20px;
`

const UploadedImage = ({ src, text }) => (
  <ImageWrapper text={text}>
    <img alt="event" src={src} />
  </ImageWrapper>
)

const Actions = styled('div')`
  display: flex;
  justify-content: flex-end;
`

function getButtonText(type) {
  return {
    create: 'Create Event',
    edit: 'Update Event'
  }[type]
}

class PartyForm extends Component {
  constructor(props) {
    super(props)
    const {
      name = '',
      description = '',
      location = '',
      start = new Date(),
      end = new Date(),
      arriveBy = new Date(),
      timezone = getLocalTimezoneOffset(),
      headerImg = '',
      deposit = '0.02',
      coolingPeriod = `${60 * 60 * 24 * 7}`,
      limitOfParticipants = 20
    } = props

    const [startDay, startTime] = getDayAndTimeFromDate(start)
    const [endDay, endTime] = getDayAndTimeFromDate(end)
    const [arriveByDay, arriveByTime] = getDayAndTimeFromDate(arriveBy)

    this.state = {
      name,
      description,
      location,
      timezone,
      startDay: new Date(startDay),
      startTime: moment(startTime).utcOffset('+00:00'),
      endDay: new Date(endDay),
      endTime: moment(endTime).utcOffset('+00:00'),
      arriveByDay: new Date(arriveByDay),
      arriveByTime: moment(arriveByTime).utcOffset('+00:00'),
      headerImg,
      deposit,
      coolingPeriod,
      limitOfParticipants,
      imageUploading: false
    }
  }

  onDrop = (acceptedFiles, mutate) => {
    acceptedFiles.forEach(file => {
      mutate({ variables: { file } }).then(({ data: { singleUpload } }) => {
        this.setState({ headerImg: singleUpload })
      })
    })
  }

  render() {
    const {
      name,
      description,
      location,
      timezone,
      startDay,
      startTime,
      endDay,
      endTime,
      arriveByDay,
      arriveByTime,
      headerImg,
      deposit,
      limitOfParticipants,
      coolingPeriod
    } = this.state

    const {
      type = 'create',
      onCompleted,
      mutation,
      address,
      children,
      variables: extraVariables = {}
    } = this.props

    const start = getDateFromDayAndTime(startDay, startTime.valueOf())
    const end = getDateFromDayAndTime(endDay, endTime.valueOf())
    const arriveBy = getDateFromDayAndTime(arriveByDay, arriveByTime.valueOf())

    const variables = {
      meta: {
        name,
        description,
        location,
        timezone,
        start,
        end,
        arriveBy,
        headerImg
      },
      ...extraVariables
    }

    if (address) {
      variables.address = address
    }

    return (
      <PartyFormContainer>
        <H2>Event Details</H2>
        <PartyFormContent>
          <InputWrapper>
            <Label>Event Name</Label>
            <TextInput
              wide
              value={name}
              onChangeText={val => this.setState({ name: val })}
              type="text"
              placeholder="Name of the event"
            />
          </InputWrapper>
          <InputWrapper>
            <Label>Description</Label>
            <TextArea
              wide
              value={description}
              onChangeText={val => this.setState({ description: val })}
              type="text"
              placeholder="Description of the event"
              rows="10"
            >
              {description}
            </TextArea>
          </InputWrapper>
          <InputWrapper>
            <Label>Location</Label>
            <TextInput
              wide
              value={location}
              onChangeText={val => this.setState({ location: val })}
              type="text"
              placeholder="Location of the event"
            />
          </InputWrapper>
          <TimezonePicker
            style={{ zIndex: 100000 }}
            value={timezone}
            onChange={timezone => this.setState({ timezone })}
            inputProps={{
              placeholder: 'Select Timezone...',
              name: 'timezone'
            }}
          />
          <InputWrapper>
            <Label>Start Day</Label>
            <DayPickerInput
              value={startDay}
              onDayChange={day => this.setState({ startDay: day })}
            />
            <Label>Start Time</Label>
            <TimePicker
              showSecond={false}
              defaultValue={startTime}
              onChange={value => {
                if (value) {
                  this.setState({ startTime: value })
                } else {
                  this.setState({ startTime: moment() })
                }
              }}
              format="h:mm a"
            />
          </InputWrapper>
          <InputWrapper>
            <Label>End Day</Label>
            <DayPickerInput
              value={endDay}
              onDayChange={day => this.setState({ endDay: day })}
            />
            <Label>End Time</Label>
            <TimePicker
              showSecond={false}
              defaultValue={endTime}
              onChange={value => {
                if (value) {
                  this.setState({ endTime: value })
                } else {
                  this.setState({ endTime: moment() })
                }
              }}
              format="h:mm a"
            />
          </InputWrapper>
          <InputWrapper>
            <Label>Arrive By Day</Label>
            <DayPickerInput
              value={arriveByDay}
              onDayChange={day => this.setState({ arriveByDay: day })}
            />
            <Label>Arrive By Time</Label>
            <TimePicker
              showSecond={false}
              defaultValue={arriveByTime}
              onChange={value => {
                if (value) {
                  this.setState({ arriveByTime: value })
                } else {
                  this.setState({ arriveByTime: moment() })
                }
              }}
              format="h:mm a"
            />
          </InputWrapper>
          <InputWrapper>
            <Label>Image</Label>
            <DropZoneWrapper>
              <Mutation mutation={SINGLE_UPLOAD}>
                {mutate => (
                  <Dropzone
                    className="dropzone"
                    onDrop={files => this.onDrop(files, mutate)}
                    accept="image/*"
                  >
                    {headerImg ? (
                      <UploadedImage
                        src={headerImg}
                        text="Click or drop a file to change photo"
                      />
                    ) : (
                      <NoImage>
                        {this.state.imageUploading
                          ? 'Uploading...'
                          : 'Click or drop a file to change photo'}
                      </NoImage>
                    )}
                  </Dropzone>
                )}
              </Mutation>
            </DropZoneWrapper>
          </InputWrapper>
          {type === 'create' && (
            <>
              <InputWrapper>
                <Label>Commitment</Label>
                <TextInput
                  value={deposit}
                  onChangeText={val => this.setState({ deposit: val })}
                  type="text"
                  placeholder="ETH"
                />
              </InputWrapper>
              <InputWrapper>
                <Label>Available spots</Label>
                <TextInput
                  value={limitOfParticipants}
                  onChangeText={val =>
                    this.setState({ limitOfParticipants: val })
                  }
                  type="text"
                  placeholder="number of participants"
                />
              </InputWrapper>
            </>
          )}
        </PartyFormContent>

        {children}

        <Actions>
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
                {getButtonText(type)}
              </Button>
            )}
          </SafeMutation>
        </Actions>
      </PartyFormContainer>
    )
  }
}

export default PartyForm
