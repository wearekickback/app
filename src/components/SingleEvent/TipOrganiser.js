import React from 'react'
import SendAndWithdraw from './SendAndWithdraw'
import WithdrawAll from './EventCTA'

const TipOrganiser = ({
  all,
  extra,
  coffee,
  tip,
  withdraw,
  Button,
  changeMode,
  changeTipAmount,
  currencySymbol,
  addresses
}) => [
  <React.Fragment>
    <p>How much would you like to tip the organiser?</p>
    <div onChange={changeTipAmount.bind(this)}>
      <input type="radio" value={all} name="tip" /> All ({all} {currencySymbol})
      <input type="radio" value={extra} name="tip" /> Extra ({extra}{' '}
      {currencySymbol})
      <input type="radio" value={coffee} name="tip" /> Coffee ({coffee}{' '}
      {currencySymbol})
    </div>
    <br></br>
    <p>
      Total tip: {tip} {currencySymbol} (and withdraw {withdraw}{' '}
      {currencySymbol})
    </p>
    <SendAndWithdraw
      addresses={addresses}
      amounts={[withdraw, tip]}
    ></SendAndWithdraw>
    <br></br>
    <a onClick={() => changeMode(WithdrawAll)}> Go back </a>
  </React.Fragment>
]

export default TipOrganiser
