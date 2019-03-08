import React, { Component } from 'react'

class Checkbox extends Component {
  render() {
    const { className, value, checked, testId, children } = this.props

    return (
      <div className={className}>
        <input
          type="checkbox"
          value={value}
          checked={checked}
          data-testid={testId}
          onChange={this._onChange}
        />{' '}
        {children}
      </div>
    )
  }

  _onChange = e => {
    if (this.props.checked !== e.target.checked) {
      this.props.onChange(e.target.checked)
    }
  }
}

export default Checkbox
