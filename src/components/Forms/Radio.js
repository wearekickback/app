import styled from 'react-emotion'
import React, { Component } from 'react'

const RadioItemContainer = styled('div')`
  margin: 1px;
`

class Radio extends Component {
  constructor() {
    super()
    this.state = {
      selected: 0
    }
  }

  render() {
    const { className, options } = this.props
    return (
      <div className={className}>
        {options.map((option, i) => {
          return (
            <RadioItemContainer>
              <label>
                <input
                  data-order={i}
                  type="radio"
                  name={className}
                  value={option.value}
                  checked={this.state.selected === i ? true : false}
                  onChange={this._onChange}
                />
                {option.text}
              </label>
            </RadioItemContainer>
          )
        })}
      </div>
    )
  }

  _onChange = (e, i) => {
    this.props.onChange(e.target)
    this.setState({
      selected: parseInt(e.target.attributes['data-order'].value)
    })
  }
}

export default Radio
