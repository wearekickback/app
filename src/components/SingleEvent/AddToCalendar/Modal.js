import React from 'react'
import styled from 'react-emotion'

import { H3 } from '../../Typography/Basic'
import { buildShareUrl, CALENDARS, isInternetExplorer } from './utils'

import { ReactComponent as CrossIcon } from '../../svg/Cross.svg'

const ModalContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Calendars = styled('div')`
  position: relative;
`

const CalendarList = styled('div')`
  width: 100%;
`
const Calendar = styled('a')`
  display: block;
  padding: 10px 0;
`

const Cancel = styled(CrossIcon)`
  cursor: pointer;
  position: absolute;
  right: 0px;
  top: 5px;
`

function Modal({ event, closeModal }) {
  const handleCalendarButtonClick = e => {
    e.preventDefault()
    const url = e.currentTarget.getAttribute('href')

    if (url.startsWith('BEGIN')) {
      const blob = new Blob([url], { type: 'text/calendar;charset=utf-8' })

      if (isInternetExplorer()) {
        window.navigator.msSaveOrOpenBlob(blob, `${event.title}.ics`)
      } else {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.setAttribute('download', `${event.title}.ics`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <ModalContainer>
      <Calendars>
        <H3>Add To Calendar</H3>
        <Cancel onClick={closeModal} />
        <CalendarList>
          {Object.values(CALENDARS).map(calendar => {
            return (
              <Calendar
                key={calendar}
                href={buildShareUrl(event, calendar)}
                onClick={handleCalendarButtonClick}
              >
                {calendar}
              </Calendar>
            )
          })}
        </CalendarList>
      </Calendars>
    </ModalContainer>
  )
}

export default Modal
