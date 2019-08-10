import React from 'react'

const CurrencyPicker = ({ daiAddress, onChange, currencyType }) => {
  const onChangeHandler = e => {
    currencyType = e.target.value
    const tokenAddress = currencyType !== 'ETH' ? daiAddress : null
    onChange({ currencyType, tokenAddress })
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
    </>
  )
}

export default CurrencyPicker
