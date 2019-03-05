import React from 'react'

const Checkbox = ({
  className,
  value,
  checked,
  testId,
  onChange,
  children
}) => (
  <div className={className}>
    <input
      type="checkbox"
      value={value}
      checked={checked}
      data-testid={testId}
      onChange={onChange}
    />{' '}
    {children}
  </div>
)

export default Checkbox
