import React from 'react'
import SendAndWithdraw from './SendAndWithdraw'
import WithdrawAll from './EventCTA'
import { A } from '../Typography/Basic'

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
  address,
  destinationAddresses
}) => (
  <>
    <p>How much would you like to tip the organiser?</p>
    <div onChange={changeTipAmount.bind(this)}>
      <input type="radio" value={all} name="tip" /> All ({all} {currencySymbol})
      <input type="radio" value={extra} name="tip" /> Extra ({extra}{' '}
      {currencySymbol})
      {all > coffee ? (
        <>
          <input type="radio" value={coffee} name="tip" /> Coffee ({coffee}{' '}
          {currencySymbol})
        </>
      ) : (
        ''
      )}
    </div>
    <br />
    <p>
      Total tip: {tip} {currencySymbol} (and withdraw {withdraw}{' '}
      {currencySymbol})
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
