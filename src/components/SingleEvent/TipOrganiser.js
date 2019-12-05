import React, { Component } from 'react'

const TipOrganiser = ({
  all,
  extra,
  coffee,
  tip,
  withdraw,
  Button,
  changeMode,
  changeTipAmount,
  currencySymbol
}) => [
  <p>How much would you like to tip the organiser?</p>,
  <div onChange={changeTipAmount.bind(this)}>
    <input type="radio" value={all} name="tip" /> All ({all} {currencySymbol})
    <input type="radio" value={extra} name="tip" /> Extra ({extra}{' '}
    {currencySymbol})
    <input type="radio" value={coffee} name="tip" /> Coffee ({coffee}{' '}
    {currencySymbol})
  </div>,
  <br></br>,
  <p>
    Total tip: {tip} {currencySymbol} (and withdraw {withdraw} {currencySymbol})
  </p>,
  <Button> Tip and Withdraw </Button>,
  <a onClick={() => changeMode('take_all')}> Go back </a>
]

export default TipOrganiser
