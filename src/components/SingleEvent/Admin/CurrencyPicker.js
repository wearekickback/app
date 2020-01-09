import React from 'react'

const CurrencyPicker = ({ onChange, currencyType }) => {
  const onChangeHandler = e => {
    currencyType = e.target.value
    onChange(currencyType)
  }

  const isChecked = checkedType => {
    return currencyType === checkedType
  }

  return (
    <>
      <label className="container">
        ETH
        <input
          type="radio"
          onChange={onChangeHandler}
          checked={isChecked('ETH')}
          name="radio"
          value="ETH"
        />
      </label>
      <label className="container">
        DAI
        <input
          type="radio"
          onChange={onChangeHandler}
          checked={isChecked('DAI')}
          name="radio"
          value="DAI"
        />
      </label>
      Token
      <label className="container">
        <input
          type="radio"
          onChange={onChangeHandler}
          checked={isChecked('Token')}
          name="radio"
          value="Token"
        />
      </label>
    </>
  )
}

export default CurrencyPicker
