import React, { useState } from 'react'
import { PLATFORM_FEE_ADDRESS } from '../../config'

import SendAndWithdraw from './SendAndWithdraw'
import WithdrawAll from './EventCTA'
import { depositValue } from '../Utils/DepositValue'
import TwitterAvatar from '../User/TwitterAvatar'
import styled from '@emotion/styled'
const UserAvatar = styled(TwitterAvatar)`
  margin-right: 10px;
  margin-left: 10px;
  display: inline-block;
`

const ContributionDetail = styled('p')`
  display: flex;
  align-items: center;
`
const ContributionUL = styled('ul')`
  list-style-type: none;
`

const ContributionLi = styled('li')``

const Contribute = ({
  address,
  percentage,
  myShare,
  changeMode,
  changeValue,
  currencySymbol,
  delimiters,
  addresses,
  roles
}) => {
  const [includeFee, setIncludeFee] = useState(!!PLATFORM_FEE_ADDRESS)
  let value = myShare.mul(percentage).div(100)
  const feePercentage = includeFee ? 5 : 0
  const feeTotalPercentage = (percentage / 100) * feePercentage
  const fee = value.mul(feePercentage).div(100)
  value = value.sub(fee)
  const leftOver = myShare.sub(value).sub(fee)
  const recipient = roles.filter(
    r => r.user.address === addresses[0].address
  )[0]
  let sendAddresses = addresses.map(a => a.address)
  let values = [value]
  if (includeFee) {
    sendAddresses.push(PLATFORM_FEE_ADDRESS)
    values.push(fee)
  }
  console.log('***contribute', {
    PLATFORM_FEE_ADDRESS,
    percentage,
    value: depositValue(value, delimiters.length, 3),
    fee: depositValue(fee, delimiters.length, 3),
    leftOver: depositValue(leftOver, delimiters.length, 3),
    sendAddresses,
    values
  })

  return (
    <>
      <p>How much would you like to contribute?</p>
      {percentage} % :{' '}
      <input
        type="range"
        value={percentage}
        name="percentage"
        onChange={changeValue.bind(this)}
        min="0"
        max="100"
      />
      <br />
      <ContributionDetail>
        <ContributionUL>
          <ContributionLi>
            Total contribution: {depositValue(value, delimiters.length, 3)}{' '}
            {currencySymbol} to{' '}
            {recipient ? (
              <UserAvatar user={recipient.user} size={5} scale={5} />
            ) : (
              `${recipient.user.address.slice(0, 5)}...`
            )}
          </ContributionLi>
          <ContributionLi>
            (
            <input
              type="checkbox"
              onClick={e => {
                setIncludeFee(!includeFee)
              }}
              checked={includeFee}
            />
            {feeTotalPercentage.toFixed(3)} % as a fee to Kickback:{' '}
            {depositValue(fee, delimiters.length, 3)} {currencySymbol})
          </ContributionLi>
          <ContributionLi>
            You withdraw:
            {depositValue(leftOver, delimiters.length, 3)} {currencySymbol}
          </ContributionLi>
        </ContributionUL>
      </ContributionDetail>
      <SendAndWithdraw
        address={address}
        addresses={sendAddresses}
        values={values}
      ></SendAndWithdraw>
      <a
        href="#/"
        onClick={e => {
          e.preventDefault()
          changeMode(WithdrawAll)
        }}
      >
        Or Go back{' '}
      </a>
    </>
  )
}

export default Contribute
