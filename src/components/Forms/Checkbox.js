import React from 'react'

const Checkbox = ({
  className,
  value,
  checked,
  onChange,
  testId,
  children
}) => {
  const _onChange = e => {
    if (checked !== e.target.checked) {
      onChange(e.target.checked)
    }
  }

  return (
    <div className={className}>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        data-testid={testId}
        onChange={_onChange}
      />{' '}
      {children}
    </div>
  )
}

export default Checkbox
