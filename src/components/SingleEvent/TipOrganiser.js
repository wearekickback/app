import React from 'react'
import SendAndWithdraw from './SendAndWithdraw'
import WithdrawAll from './EventCTA'
import { A } from '../Typography/Basic'

const TipOrganiser = ({
  all,
  extra,
  custom,
  tip,
  withdraw,
  Button,
  changeMode,
  changeTipAmount,
  currencySymbol,
  address,
  destinationAddresses
}) => (
  <>
    <p>How much would you like to tip the organiser?</p>
    <div onChange={changeTipAmount.bind(this)}>
      <input type="radio" value={all} name="tip" checked={tip === all} /> All (
      {all.toFixed(3)} {currencySymbol})
      <input
        type="radio"
        value={custom}
        name="tip"
        checked={tip === custom}
      />{' '}
      Preferred ({custom.toFixed(3)} {currencySymbol} )
      <input
        type="radio"
        value={extra}
        name="tip"
        checked={tip === extra}
      />{' '}
      Extra ({extra.toFixed(3)} {currencySymbol})
    </div>
    <br />
    <p>
      Total tip: {parseFloat(tip).toFixed(3)} {currencySymbol} (and withdraw{' '}
      {withdraw.toFixed(3)} {currencySymbol})
    </p>
    <SendAndWithdraw
      address={address}
      destinationAddresses={destinationAddresses}
      destinationAmounts={[tip]}
    />
    <br />
    <A onClick={() => changeMode(WithdrawAll)}> Go back </A>
  </>
)

export default TipOrganiser
