import React, { Component } from 'react'
import sanitizeHtml from 'sanitize-html'
import styled from '@emotion/styled'
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
import { getPartyImageLarge } from '../../../utils/parties'
import { GlobalConsumer } from '../../../GlobalState'
import _ from 'lodash'

import {
  getDayAndTimeFromDate,
  getDateFromDayAndTime,
  getLocalTimezoneOffset
} from '../../../utils/dates'
import { extractNewPartyAddressFromTx, EMPTY_ADDRESS } from '../../../api/utils'

import { SINGLE_UPLOAD } from '../../../graphql/mutations'
import { CREATE_PARTY } from '../../../graphql/mutations'
import {
  TOKEN_QUERY,
  TOKEN_CLIENT_QUERY,
  TOKEN_SYMBOL_QUERY
} from '../../../graphql/queries'
import ChainMutation, {
  ChainMutationButton
} from '../../../components/ChainMutation'
import SafeMutation from '../../../components/SafeMutation'
import Button from '../../../components/Forms/Button'
import TextInput from '../../../components/Forms/TextInput'
import TextArea from '../../../components/Forms/TextArea'
import Label from '../../../components/Forms/Label'
import { H2 } from '../../../components/Typography/Basic'
import SafeQuery from '../../SafeQuery'
import CurrencyPicker from './CurrencyPicker'
import Deployer from './Deployer'

const Warning = styled('div')`
  color: red;
`

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
  ul {
    li {
      button {
        background: white;
      }
    }
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
    <img alt="event" src={getPartyImageLarge(src)} />
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
  if (symbol !== 'ETH' || !price) return symbol
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

const TokenSelector = ({
  nativeCurrencyType,
  currencyType,
  tokenAddress,
  onChangeCurrencyType,
  onChangeAddress
}) => {
  return (
    <SafeQuery query={TOKEN_SYMBOL_QUERY} variables={{ symbol: 'DAI' }}>
      {({
        data: {
          token: { address: daiAddress }
        },
        loading
      }) => {
        return (
          <>
            <Deployer />
            <InputWrapper>
              <Label>Currency</Label>
              <CurrencyPicker
                nativeCurrencyType={nativeCurrencyType}
                currencyType={currencyType}
                onChange={newCurrencyType => {
                  let tokenAddress
                  if (newCurrencyType === nativeCurrencyType) {
                    tokenAddress = EMPTY_ADDRESS
                  } else if (newCurrencyType === 'DAI') {
                    tokenAddress = daiAddress
                  } else {
                    tokenAddress = ''
                  }
                  onChangeCurrencyType(newCurrencyType)
                  onChangeAddress(tokenAddress)
                }}
              />
            </InputWrapper>
            {currencyType === 'TOKEN' && (
              <InputWrapper>
                <Label>Token Address</Label>
                <TextInput
                  value={tokenAddress}
                  onChangeText={onChangeAddress}
                  type="text"
                  placeholder="0x..."
                />
              </InputWrapper>
            )}
          </>
        )
      }}
    </SafeQuery>
  )
}

const DepositInput = ({
  deposit,
  onChangeDeposit,
  currencyType,
  tokenAddress,
  symbol,
  decimals,
  price
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
            validityRegex = new RegExp(`^${integerRegex}(${decimalsRegex})?$`)
          }

          const isValid = validityRegex.test(val)

          if (isValid && val !== deposit) {
            onChangeDeposit(val)
          }
        }}
      />
      <CommitmentInUsdContainer>
        {isAddress(tokenAddress) &&
          commitmentInUsd({ currencyType, symbol, price, deposit })}
      </CommitmentInUsdContainer>
    </InputWrapper>
  )
}

const DateTimeInput = ({
  label,
  day,
  time,
  setDay,
  setTime,
  before,
  after
}) => {
  return (
    <InputWrapper>
      <Label>{label}</Label>
      <DateContent>
        <DayPickerInputWrapper>
          <DayPickerInput
            value={day}
            onDayChange={setDay}
            dayPickerProps={{
              disabledDays: [
                { before: before.toDate() },
                { after: after.toDate() }
              ]
            }}
          />
        </DayPickerInputWrapper>
        <TimePicker
          showSecond={false}
          defaultValue={time}
          onChange={value => {
            if (value) {
              setTime(value)
            } else {
              setTime(moment())
            }
          }}
          format="h:mm a"
        />
      </DateContent>
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
      limitOfParticipants = 10,
      tokenAddress = EMPTY_ADDRESS,
      status = 'public',
      optional,
      roles = []
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
      currencyType: null,
      price: null,
      coolingPeriod,
      limitOfParticipants,
      imageUploading: false,
      status,
      optional,
      roles
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
          this.setState({ deposit: 10 })
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
      currencyType,
      deposit,
      tokenAddress,
      limitOfParticipants,
      coolingPeriod,
      status,
      roles,
      optional
    } = this.state

    const {
      type = 'create',
      mutation,
      address,
      children,
      createdAt,
      variables: extraVariables = {}
    } = this.props

    const start = getDateFromDayAndTime(startDay, startTime.valueOf())
    const end = getDateFromDayAndTime(endDay, endTime.valueOf())
    const arriveBy = getDateFromDayAndTime(arriveByDay, arriveByTime.valueOf())
    const before = createdAt ? moment(createdAt) : moment()
    const after = before.clone().add(1, 'month')

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
        status,
        optional
      },
      ...extraVariables
    }

    if (address) {
      variables.address = address
    }

    let contributionOptions = roles.map(r => {
      return {
        label: r.user.username,
        value: r.user.address
      }
    })
    if (contributionOptions.length > 0) {
      contributionOptions.push({
        label: 'No contribution',
        value: ''
      })
    }
    let eventWhitelist
    if (
      this.state.optional &&
      this.state.optional.event_whitelist &&
      this.state.optional.event_whitelist
    ) {
      eventWhitelist = this.state.optional.event_whitelist
    }
    return (
      <GlobalConsumer>
        {({ networkState }) => (
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
              <DateTimeInput
                label="Start Date"
                day={startDay}
                time={startTime}
                before={before}
                after={after}
                setDay={startDay => this.setState({ startDay })}
                setTime={startTime => this.setState({ startTime })}
              />
              <DateTimeInput
                label="End Date"
                day={endDay}
                time={endTime}
                before={before}
                after={after.clone().add(1, 'month')}
                setDay={endDay => this.setState({ endDay })}
                setTime={endTime => this.setState({ endTime })}
              />
              <DateTimeInput
                label="Arrive By Date"
                day={arriveByDay}
                time={arriveByTime}
                before={before}
                after={after}
                setDay={arriveByDay => this.setState({ arriveByDay })}
                setTime={arriveByTime => this.setState({ arriveByTime })}
              />
              <ImageInput image={headerImg} onDrop={this.uploadImage} />
              <InputWrapper>
                <Label>Visibility</Label>
                <VisibilityDropdown
                  options={visibilityOptions}
                  onChange={option => this.setState({ status: option.value })}
                  value={visibilityOptions.find(
                    option => option.value === this.state.status
                  )}
                  placeholder="Select an option"
                />
              </InputWrapper>
              <InputWrapper>
                <Label>Contribution</Label>
                <p>
                  At the end of the event, you can ask attendees to contribute
                  part of payout (Kickback will be taking 5% fee).
                </p>
                {contributionOptions.length === 0 ? (
                  <p>
                    You can choose contribution address from the list of admins
                    once this event is created
                  </p>
                ) : (
                  <VisibilityDropdown
                    options={contributionOptions}
                    onChange={option => {
                      let recepients
                      if (option.label !== 'No contribution') {
                        recepients = [{ address: option.value }]
                      } else {
                        recepients = null
                      }
                      this.setState({
                        optional: { recepients }
                      })
                      this.setState({
                        optional: { ...optional, recepients }
                      })
                    }}
                    value={contributionOptions.find(option => {
                      let recepient =
                        this.state.optional &&
                        this.state.optional.recepients &&
                        this.state.optional.recepients.length > 0 &&
                        this.state.optional.recepients[0].address
                      return option.value === recepient
                    })}
                    placeholder="Select an option"
                  />
                )}
              </InputWrapper>

              {type !== 'create' && (
                <InputWrapper>
                  <Label>White listing</Label>
                  <p>
                    You can only allow certain token holders to be able to RSVP.
                  </p>
                  <TextInput
                    onChangeText={text => {
                      let newValue
                      if (eventWhitelist) {
                        newValue = _.cloneDeep(optional)
                        newValue.event_whitelist.address = text
                      } else {
                        newValue = {
                          ...optional,
                          event_whitelist: { networkId: 1, address: text }
                        }
                      }
                      this.setState({
                        optional: newValue
                      })
                    }}
                    value={eventWhitelist && eventWhitelist.address}
                  />
                  {eventWhitelist && eventWhitelist.address && (
                    <TextInput
                      onChangeText={text => {
                        let newValue
                        newValue = _.cloneDeep(optional)
                        newValue.event_whitelist.amount = text
                        this.setState({
                          optional: newValue
                        })
                      }}
                      value={eventWhitelist && eventWhitelist.amount}
                    />
                  )}
                </InputWrapper>
              )}

              {type === 'create' && (
                <>
                  <SafeQuery
                    query={TOKEN_QUERY}
                    variables={{ address: EMPTY_ADDRESS }}
                  >
                    {({
                      data: {
                        token: {
                          symbol: nativeTokenSymbol,
                          decimals: nativeTokenDecimals
                        }
                      }
                    }) => {
                      if (!currencyType)
                        this.setState({ currencyType: nativeTokenSymbol })
                      return (
                        <SafeQuery
                          query={TOKEN_CLIENT_QUERY}
                          variables={{ tokenAddress }}
                        >
                          {({
                            data: {
                              token: { name, symbol, decimals }
                            },
                            loading
                          }) => {
                            const currentTokenSymbol =
                              symbol || nativeTokenSymbol
                            const currentTokenDecimals =
                              decimals || nativeTokenDecimals
                            return (
                              <>
                                <TokenSelector
                                  nativeCurrencyType={nativeTokenSymbol}
                                  currencyType={currencyType}
                                  tokenAddress={tokenAddress}
                                  onChangeCurrencyType={currencyType =>
                                    this.setState({ currencyType, deposit: 0 })
                                  }
                                  onChangeAddress={tokenAddress =>
                                    this.setState({ tokenAddress })
                                  }
                                />
                                <DepositInput
                                  deposit={deposit}
                                  onChangeDeposit={deposit =>
                                    this.setState({ deposit })
                                  }
                                  currencyType={currencyType}
                                  tokenAddress={tokenAddress}
                                  symbol={currentTokenSymbol}
                                  decimals={currentTokenDecimals}
                                  price={this.state.price}
                                />
                                {currentTokenSymbol === 'DAI' ||
                                currentTokenSymbol === 'XDAI' ? (
                                  <Warning>
                                    Please do not set more than 10{' '}
                                    {currentTokenSymbol} as this is in alpha and
                                    could have some bugs.
                                  </Warning>
                                ) : (
                                  ''
                                )}
                              </>
                            )
                          }}
                        </SafeQuery>
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
                  {networkState.expectedNetworkName !== 'Mainnet' ? (
                    <InputWrapper>
                      <Label>Cooling Period</Label>
                      <TextInput
                        value={coolingPeriod}
                        onChangeText={val =>
                          this.setState({ coolingPeriod: val })
                        }
                        type="text"
                        placeholder="cooling period"
                      />
                    </InputWrapper>
                  ) : (
                    ''
                  )}
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
                              query={TOKEN_CLIENT_QUERY}
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
                                            decimals: decimals || 18,
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
        )}
      </GlobalConsumer>
    )
  }
}

export default PartyForm
