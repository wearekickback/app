import React from 'react'

const CurrencyPicker = ({ onChange, currencyType, nativeCurrencyType }) => {
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
        {nativeCurrencyType}
        <input
          type="radio"
          onChange={onChangeHandler}
          checked={isChecked(nativeCurrencyType)}
          name="radio"
          value={nativeCurrencyType}
        />
      </label>
      {nativeCurrencyType === 'ETH' ? (
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
      ) : (
        ''
      )}
      <label className="container">
        ERC20
        <input
          type="radio"
          onChange={onChangeHandler}
          checked={isChecked('TOKEN')}
          name="radio"
          value="TOKEN"
        />
      </label>
    </>
  )
}

export default CurrencyPicker
