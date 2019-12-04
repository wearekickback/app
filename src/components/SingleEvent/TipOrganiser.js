import React, { Component } from 'react'

const TipOrganiser = ({
  all,
  extra,
  coffee,
  tip,
  withdraw,
  Button,
  changeMode,
  changeTipAmount
}) => [
  <p>How much would you like to tip the organiser?</p>,
  <div onChange={changeTipAmount.bind(this)}>
    <input type="radio" value={all} name="tip" /> All ({all}) ETH
    <input type="radio" value={extra} name="tip" /> Extra ({extra} ETH )
    <input type="radio" value={coffee} name="tip" /> Coffee ({coffee}) ETH
  </div>,
  <br></br>,
  <p>
    Total tip: {tip} ETH (and withdraw {withdraw} ETH)
  </p>,
  <Button> Tip and Withdraw </Button>,
  <a onClick={() => changeMode('take_all')}> Go back </a>
]

export default TipOrganiser
