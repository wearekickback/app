import React, { Component } from 'react'
import styled from 'react-emotion'
import Dropzone from 'react-dropzone'
import 'rc-time-picker/assets/index.css'
import { Mutation } from 'react-apollo'

import { SINGLE_UPLOAD } from '../../../graphql/mutations'
import DateTimePicker from 'react-datetime-picker'

import SafeMutation from '../../SafeMutation'
import Button from '../../Forms/Button'
import TextInput from '../../Forms/TextInput'
import TextArea from '../../Forms/TextArea'
import Label from '../../Forms/Label'
import { H2 } from '../../Typography/Basic'

const PartyFormContainer = styled('div')``
const PartyFormContent = styled('div')``

const NoImage = styled('div')`
  color: white;
  background: #6e76ff;
  max-width: 100%;
  height: 300px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`

const ImageWrapper = styled('div')`
  &:hover {
    &:before {
      content: '';
      width: 100%;
      height: 100%;
      background: #6e76ff;
      opacity: 0.85;
    }
  }
`

const UploadedImage = ({ src }) => (
  <ImageWrapper>
    <img alt="event" src={src} />
  </ImageWrapper>
)

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
      headerImg = '',
      deposit = '0.02',
      coolingPeriod = `${60 * 60 * 24 * 7}`,
      limitOfParticipants = 20
    } = props

    this.state = {
      name,
      description,
      location,
      start,
      end,
      arriveBy,
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
      start,
      end,
      arriveBy,
      headerImg,
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

    const variables = {
      meta: { name, description, location, start, end, arriveBy, headerImg },
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
            wide
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
            type="text"
            placeholder="Name of the event"
          />
          <Label>Description</Label>
          <TextArea
            wide
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="Description of the event"
            rows="10"
          >
            {description}
          </TextArea>
          <Label>Location</Label>
          <TextInput
            wide
            value={location}
            onChange={e => this.setState({ location: e.target.value })}
            type="text"
            placeholder="Location of the event"
          />
          <Label>Start date</Label>
          <DateTimePicker
            onChange={d => this.setState({ start: d.toISOString() })}
            value={new Date(start)}
          />
          <Label>End date</Label>
          <DateTimePicker
            onChange={d => this.setState({ end: d.toISOString() })}
            value={new Date(end)}
          />
          <Label>Arrive by</Label>
          <DateTimePicker
            onChange={d => this.setState({ arriveBy: d.toISOString() })}
            value={new Date(arriveBy || start)}
          />
          <br />
          <Label>Image</Label>
          <Mutation mutation={SINGLE_UPLOAD}>
            {mutate => (
              <Dropzone
                className="dropzone"
                onDrop={files => this.onDrop(files, mutate)}
                accept="image/*"
              >
                {headerImg ? (
                  <UploadedImage src={headerImg} />
                ) : (
                  <NoImage>
                    {this.state.imageUploading
                      ? 'Uploading...'
                      : 'Click here to upload a photo'}
                  </NoImage>
                )}
              </Dropzone>
            )}
          </Mutation>
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
