import React from 'react'
import styled from '@emotion/styled'
import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import DefaultTimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import 'react-dropdown/style.css'

const DayPickerInputWrapper = styled('div')`
  margin-right: 10px;
  input {
    border: 1px solid #edeef4;
    border-radius: 6px;
    color: #2b2b2b;
    height: 40px;
    font-size: 14px;
    padding-left: 17px;
  }
`

const TimePicker = styled(DefaultTimePicker)`
  input {
    border-radius: 6px;
    border: 1px solid #edeef4;
    color: #2b2b2b;
    height: 40px;
    font-size: 14px;
    padding-left: 17px;
  }
`

const DateContent = styled('div')`
  display: flex;
`

const InputDateTime = ({ day, time, setDay, setTime }) => {
  return (
    <DateContent>
      <DayPickerInputWrapper>
        <DayPickerInput value={day} onDayChange={setDay} />
      </DayPickerInputWrapper>
      <TimePicker
        showSecond={false}
        defaultValue={time}
        onChange={value => {
          if (value) {
            setTime(value)
          } else {
            setTime(moment())
          }
        }}
        format="h:mm a"
      />
    </DateContent>
  )
}

export default InputDateTime
