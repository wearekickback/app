import React, { Component } from 'react'
import styled from 'react-emotion'
import Select from 'react-select'
// import { ReactComponent as Arrow } from '../svg/arrowDown.svg'

const SelectContainer = styled('div')``

// const DropdownIndicator = props => {
//   return (
//     components.DropdownIndicator && (
//       <components.DropdownIndicator {...props}>
//         <Arrow />
//       </components.DropdownIndicator>
//     )
//   )
// }

const styles = {
  control: (styles, { isFocused }) => ({
    ...styles,
    borderRadius: 4,
    border: isFocused ? '1px solid #6E76FF' : '1px solid #6E76FF',
    // backgroundColor: 'white',
    // textTransform: 'uppercase',
    // fontWeight: '700',
    fontSize: '14px'
    // color: '#2B2B2B',
    // letterSpacing: '0.5px'
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      // backgroundColor: isDisabled ? null : isSelected ? 'blue' : null
      color: isDisabled ? null : isSelected ? '#ffffff' : null,
      backgroundColor: isDisabled ? null : isSelected ? '#6E76FF' : null,
      cursor: isFocused ? 'pointer' : 'inherit',
      fontSize: '14px'
      // letterSpacing: '0.5px',
      // color: isDisabled ? '#ccc' : isSelected ? 'black' : '#ccc',
      // cursor: isDisabled ? 'not-allowed' : 'default'
    }
  },
  input: styles => ({ ...styles }),
  placeholder: styles => ({ ...styles }),
  singleValue: (styles, { data }) => ({ ...styles })
}

class SelectWrapper extends Component {
  render() {
    return (
      <SelectContainer>
        <Select
          // components={{ DropdownIndicator }}
          styles={styles}
          {...this.props}
        />
      </SelectContainer>
    )
  }
}

export default SelectWrapper
