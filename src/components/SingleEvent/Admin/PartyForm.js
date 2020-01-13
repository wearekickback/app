import React, { Component } from 'react'
import sanitizeHtml from 'sanitize-html'
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
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { isAddress } from 'web3-utils'

import {
  getDayAndTimeFromDate,
  getDateFromDayAndTime,
  getLocalTimezoneOffset
} from 'utils/dates'
import { extractNewPartyAddressFromTx, EMPTY_ADDRESS } from 'api/utils'

import { SINGLE_UPLOAD } from 'graphql/mutations'
import { CREATE_PARTY } from 'graphql/mutations'
import {
  TOKEN_QUERY,
  TOKEN_DECIMALS_QUERY,
  TOKEN_SYMBOL_QUERY
} from 'graphql/queries'
import ChainMutation, { ChainMutationButton } from 'components/ChainMutation'
import SafeMutation from 'components/SafeMutation'
import Button from 'components/Forms/Button'
import TextInput from 'components/Forms/TextInput'
import TextArea from 'components/Forms/TextArea'
import Label from 'components/Forms/Label'
import { H2 } from 'components/Typography/Basic'
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

const VisibilityDropdown = styled(Dropdown)`
  .Dropdown-control {
    border: solid 1px #edeef4;
    border-radius: 5px;
    padding-left: 15px;
  }
`

const commitmentInUsd = ({ currencyType, symbol, price, deposit }) => {
  if (currencyType !== 'ETH' || !price) return symbol
  const totalPrice = (deposit * price).toFixed(2)
  return `${symbol} ($${totalPrice})`
}

const unit = 10 // $10 as a guide price

const visibilityOptions = [
  {
    label: 'Public',
    value: 'public'
  },
  {
    label: 'Private',
    value: 'private'
  }
]

const ImageInput = ({ image, uploading, onDrop }) => {
  return (
    <InputWrapper>
      <Label>Image</Label>
      <DropZoneWrapper>
        <Mutation mutation={SINGLE_UPLOAD}>
          {mutate => (
            <Dropzone
              className="dropzone"
              onDrop={files => onDrop(files, mutate)}
              accept="image/*"
            >
              {image ? (
                <UploadedImage
                  src={image}
                  text="Click or drop a file to change photo"
                />
              ) : (
                <NoImage>
                  {uploading
                    ? 'Uploading...'
                    : 'Click or drop a file to change photo'}
                </NoImage>
              )}
            </Dropzone>
          )}
        </Mutation>
      </DropZoneWrapper>
    </InputWrapper>
  )
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
      deposit = null,
      coolingPeriod = `${60 * 60 * 24 * 7}`,
      limitOfParticipants = 20,
      tokenAddress = EMPTY_ADDRESS,
      status = 'public'
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
      currencyType: 'ETH',
      price: null,
      coolingPeriod,
      limitOfParticipants,
      imageUploading: false,
      status
    }
  }

  uploadImage = (acceptedFiles, mutate) => {
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
      coolingPeriod,
      status
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
        description: sanitizeHtml(description),
        location,
        timezone,
        start,
        end,
        arriveBy,
        headerImg,
        status
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
          <ImageInput image={headerImg} onDrop={this.uploadImage} />
          <InputWrapper>
            <Label>Visibility</Label>
            <VisibilityDropdown
              options={visibilityOptions}
              onChange={option => {
                this.setState({
                  status: option.value
                })
              }}
              value={visibilityOptions.find(
                option => option.value === this.state.status
              )}
              placeholder="Select an option"
            />
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
                  return (
                    <>
                      <InputWrapper>
                        <Label>Currency</Label>
                        <CurrencyPicker
                          currencyType={this.state.currencyType}
                          onChange={currencyType => {
                            let tokenAddress
                            if (currencyType === 'ETH') {
                              tokenAddress = EMPTY_ADDRESS
                            } else if (currencyType === 'DAI') {
                              tokenAddress = address
                            } else {
                              tokenAddress = ''
                            }
                            this.setState({
                              currencyType,
                              tokenAddress,
                              deposit: 0
                            })
                          }}
                        />
                      </InputWrapper>
                      {this.state.currencyType === 'TOKEN' && (
                        <InputWrapper>
                          <Label>Token Address</Label>
                          <TextInput
                            value={this.state.tokenAddress}
                            onChangeText={val => {
                              this.setState({ tokenAddress: val })
                            }}
                            type="text"
                            placeholder="0x..."
                          />
                        </InputWrapper>
                      )}
                    </>
                  )
                }}
              </SafeQuery>
              <SafeQuery query={TOKEN_QUERY} variables={{ tokenAddress }}>
                {({
                  data: {
                    token: { name, symbol, decimals }
                  },
                  loading
                }) => {
                  return (
                    <InputWrapper>
                      <Label>Commitment</Label>
                      <CommitmentInput
                        value={deposit}
                        onChangeText={val => {
                          // We need to check that the deposit isn't dividing up the token below its smallest unit.

                          // by default we allow any input
                          let validityRegex = /.*/

                          const integerRegex = '\\d*'
                          if (decimals === 0 || decimals === '0') {
                            // If token is indivisible, then only allow integer input
                            validityRegex = new RegExp(`^${integerRegex}$`)
                          } else if (decimals > 0) {
                            // Otherwise optionally allow a decimal point followed by
                            // up to the number of decimal places as defined in token contract
                            const decimalsRegex = `\\.\\d{0,${decimals}}`
                            validityRegex = new RegExp(
                              `^${integerRegex}(${decimalsRegex})?$`
                            )
                          }

                          const isValid = validityRegex.test(val)

                          if (isValid && val !== this.props.value) {
                            this.setState({ deposit: val })
                          }
                        }}
                      />
                      <CommitmentInUsdContainer>
                        {isAddress(this.state.tokenAddress) &&
                          commitmentInUsd({
                            currencyType: this.state.currencyType,
                            symbol: symbol,
                            price: this.state.price,
                            deposit: this.state.deposit
                          })}
                      </CommitmentInUsdContainer>
                    </InputWrapper>
                  )
                }}
              </SafeQuery>
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
                        <SafeQuery
                          query={TOKEN_DECIMALS_QUERY}
                          variables={{ tokenAddress }}
                        >
                          {({
                            data: {
                              token: { decimals }
                            },
                            loading
                          }) => {
                            return (
                              <ChainMutationButton
                                analyticsId="Deploy Event Contract"
                                result={result}
                                type={address ? 'disabled' : ''}
                                onClick={() => {
                                  mutate().then(({ data: { id } }) => {
                                    createParty({
                                      variables: {
                                        id,
                                        deposit,
                                        decimals,
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
                            )
                          }}
                        </SafeQuery>
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
