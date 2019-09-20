import React, { Component } from 'react'
import styled from 'react-emotion'
import Dropzone from 'react-dropzone'
import { Mutation } from 'react-apollo'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import DefaultTimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import DefaultTimezonePicker from 'react-timezone'
import getEtherPrice from '../../../api/price'
import { Link } from 'react-router-dom'
import {
  getDayAndTimeFromDate,
  getDateFromDayAndTime,
  getLocalTimezoneOffset
} from 'utils/dates'
import { extractNewPartyAddressFromTx } from 'api/utils'

import { SINGLE_UPLOAD } from 'graphql/mutations'
import { CREATE_PARTY } from 'graphql/mutations'
import { TOKEN_SYMBOL_QUERY } from 'graphql/queries'
import ChainMutation, { ChainMutationButton } from 'components/ChainMutation'
import SafeMutation from 'components/SafeMutation'
import Button from 'components/Forms/Button'
import TextInput from 'components/Forms/TextInput'
import TextArea from 'components/Forms/TextArea'
import Label from 'components/Forms/Label'
import { H2 } from 'components/Typography/Basic'
import Web3 from 'web3'
import SafeQuery from '../../SafeQuery'
import CurrencyPicker from './CurrencyPicker'

const PartyFormContainer = styled('div')`
  max-width: 768px;
`
const PartyFormContent = styled('div')``

const InputWrapper = styled('div')`
  margin-bottom: 20px;
`

const TimezonePicker = styled(DefaultTimezonePicker)`
  z-index: 1;
  input[type='text'] {
    border-radius: 6px;
    width: 300px;
  }
`

const DayPickerInputWrapper = styled('div')`
  margin-right: 10px;
  input {
    border: 1px solid #edeef4;
    border-radius: 6px;
    color: #2b2b2b;
    height: 40px;
    font-size: 14px;
    padding-left: 17px;
  }
`

const TimePicker = styled(DefaultTimePicker)`
  input {
    border-radius: 6px;
    border: 1px solid #edeef4;
    color: #2b2b2b;
    height: 40px;
    font-size: 14px;
    padding-left: 17px;
  }
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
  flex-direction: column;
  align-items: flex-end;
`

function getButtonText(type) {
  return {
    create: 'Create Event',
    edit: 'Update Event'
  }[type]
}

const DateContent = styled('div')`
  display: flex;
`

const CommitmentInput = styled(TextInput)`
  width: 170px;
  display: inline-table;
`

const CommitmentInUsdContainer = styled('span')`
  padding-left: 1em;
`

const commitmentInUsd = ({ tokenAddress, price, deposit }) => {
  if (Web3.utils.isAddress(tokenAddress)) return 'DAI'
  if (!price) return 'ETH'
  const totalPrice = (deposit * price).toFixed(2)
  return `ETH ($${totalPrice})`
}

const unit = 10 // $10 as a guide price

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
      deposit = null,
      coolingPeriod = `${60 * 60 * 24 * 7}`,
      limitOfParticipants = 20,
      tokenAddress = ''
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
      tokenAddress,
      daiAddress: '',
      currencyType: 'ETH',
      price: null,
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

  componentDidMount() {
    getEtherPrice()
      .then(r => {
        if (r && r.result && r.result.ethusd) {
          const price = parseFloat(r.result.ethusd)
          this.setState({ price: price })
          if (!this.state.deposit) {
            const ethCommitment = (unit / price).toFixed(2)
            this.setState({ deposit: ethCommitment })
          }
        }
      })
      .finally(() => {
        if (!this.state.deposit) {
          this.setState({ deposit: 0.02 })
        }
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
      tokenAddress,
      limitOfParticipants,
      coolingPeriod
    } = this.state

    const {
      type = 'create',
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
          <InputWrapper>
            <Label>Timezone</Label>
            <TimezonePicker
              value={timezone}
              onChange={timezone => this.setState({ timezone })}
              inputProps={{
                placeholder: 'Select Timezone...',
                name: 'timezone'
              }}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>Start Date</Label>
            <DateContent>
              <DayPickerInputWrapper>
                <DayPickerInput
                  value={startDay}
                  onDayChange={day => this.setState({ startDay: day })}
                />
              </DayPickerInputWrapper>
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
            </DateContent>
          </InputWrapper>
          <InputWrapper>
            <Label>End Date</Label>
            <DateContent>
              <DayPickerInputWrapper>
                <DayPickerInput
                  value={endDay}
                  onDayChange={day => this.setState({ endDay: day })}
                />
              </DayPickerInputWrapper>
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
            </DateContent>
          </InputWrapper>
          <InputWrapper>
            <Label>Arrive By Date</Label>
            <DateContent>
              <DayPickerInputWrapper>
                <DayPickerInput
                  value={arriveByDay}
                  onDayChange={day => this.setState({ arriveByDay: day })}
                />
              </DayPickerInputWrapper>
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
            </DateContent>
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
              <SafeQuery
                query={TOKEN_SYMBOL_QUERY}
                variables={{ symbol: 'DAI' }}
              >
                {({
                  data: {
                    token: { address }
                  },
                  loading
                }) => {
                  if (address && !this.state.daiAddress) {
                    this.setState({ daiAddress: address })
                  }
                  return (
                    <InputWrapper>
                      <Label>Currency</Label>
                      <CurrencyPicker
                        currencyType={this.state.currencyType}
                        daiAddress={this.state.daiAddress}
                        onChange={({ currencyType, tokenAddress }) => {
                          this.setState({ currencyType, tokenAddress })
                        }}
                      />
                    </InputWrapper>
                  )
                }}
              </SafeQuery>
              <InputWrapper>
                <Label>Commitment</Label>
                <CommitmentInput
                  value={deposit}
                  onChangeText={val => this.setState({ deposit: val })}
                  type="text"
                />
                <CommitmentInUsdContainer>
                  {commitmentInUsd({
                    tokenAddress: this.state.tokenAddress,
                    price: this.state.price,
                    deposit: this.state.deposit
                  })}
                </CommitmentInUsdContainer>
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
          >
            {mutate =>
              type === 'create' ? (
                <ChainMutation mutation={CREATE_PARTY} resultKey="create">
                  {(createParty, result) => {
                    const address = result.data
                      ? extractNewPartyAddressFromTx(result.data)
                      : null

                    return (
                      <>
                        <ChainMutationButton
                          analyticsId="Deploy Event Contract"
                          result={result}
                          type={address ? 'disabled' : ''}
                          userAddress={true}
                          onClick={() => {
                            mutate().then(({ data: { id } }) => {
                              createParty({
                                variables: {
                                  id,
                                  deposit,
                                  limitOfParticipants,
                                  coolingPeriod,
                                  tokenAddress
                                }
                              })
                            })
                          }}
                          preContent={getButtonText(type)}
                          postContent="Deployed!"
                        />
                        {address ? (
                          <p>
                            Event deployed at {address}!{' '}
                            <Link to={`/event/${address}`}>
                              View event page
                            </Link>
                          </p>
                        ) : null}
                      </>
                    )
                  }}
                </ChainMutation>
              ) : (
                <Button onClick={mutate} analyticsId={type}>
                  {getButtonText(type)}
                </Button>
              )
            }
          </SafeMutation>
        </Actions>
      </PartyFormContainer>
    )
  }
}

export default PartyForm
