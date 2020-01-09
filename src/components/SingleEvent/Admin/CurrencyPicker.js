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
      <label class="container">
        ETH
        <input
          type="radio"
          onChange={onChangeHandler}
          checked={isChecked('ETH')}
          name="radio"
          value="ETH"
        />
      </label>
      <label class="container">
        DAI
        <input
          type="radio"
          onChange={onChangeHandler}
          checked={isChecked('DAI')}
          name="radio"
          value="DAI"
        />
      </label>
      <label class="container">
        Token
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
