import React from 'react'
import SendAndWithdraw from './SendAndWithdraw'
import WithdrawAll from './EventCTA'

const Contribute = ({
  address,
  percentage,
  myShare,
  changeMode,
  changeValue,
  currencySymbol,
  delimiters,
  addresses
}) => {
  const value = myShare * (percentage / 100)
  const leftOver = myShare - value
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
      <br></br>
      <p>
        Total contribution: {value / delimiters} {currencySymbol} (and withdraw{' '}
        {leftOver / delimiters} {currencySymbol})
      </p>
      <SendAndWithdraw
        address={address}
        addresses={addresses}
        values={[value]}
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
