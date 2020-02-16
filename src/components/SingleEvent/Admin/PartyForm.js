import React, { Component } from 'react'
import sanitizeHtml from 'sanitize-html'
import styled from '@emotion/styled'
import moment from 'moment'
import 'react-day-picker/lib/style.css'
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
import InputImage from 'components/Forms/InputImage'
import InputDateTime from 'components/Forms/InputDateTime'
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

const TokenSelector = ({
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
            <InputWrapper>
              <Label>Currency</Label>
              <CurrencyPicker
                currencyType={currencyType}
                onChange={newCurrencyType => {
                  let tokenAddress
                  if (newCurrencyType === 'ETH') {
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
      currencyType,
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
            <InputDateTime
              day={startDay}
              time={startTime}
              setDay={startDay => this.setState({ startDay })}
              setTime={startTime => this.setState({ startTime })}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>End Date</Label>
            <InputDateTime
              day={endDay}
              time={endTime}
              setDay={endDay => this.setState({ endDay })}
              setTime={endTime => this.setState({ endTime })}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>Arrive By Date</Label>
            <InputDateTime
              day={arriveByDay}
              time={arriveByTime}
              setDay={arriveByDay => this.setState({ arriveByDay })}
              setTime={arriveByTime => this.setState({ arriveByTime })}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>Image</Label>
            <InputImage image={headerImg} onDrop={this.uploadImage} />
          </InputWrapper>
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
          {type === 'create' && (
            <>
              <TokenSelector
                currencyType={currencyType}
                tokenAddress={tokenAddress}
                onChangeCurrencyType={currencyType =>
                  this.setState({ currencyType, deposit: 0 })
                }
                onChangeAddress={tokenAddress =>
                  this.setState({ tokenAddress })
                }
              />
              <SafeQuery query={TOKEN_QUERY} variables={{ tokenAddress }}>
                {({
                  data: {
                    token: { name, symbol, decimals }
                  },
                  loading
                }) => {
                  return (
                    <DepositInput
                      deposit={deposit}
                      onChangeDeposit={deposit => this.setState({ deposit })}
                      currencyType={currencyType}
                      tokenAddress={tokenAddress}
                      symbol={symbol}
                      decimals={decimals}
                      price={this.state.price}
                    />
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
