import React from 'react'
import styled from 'react-emotion'

import { ADD_TO_CALENDAR } from '../../../modals'
import Modal from './Modal'
import { useModalContext } from '../../../contexts/ModalContext'

const Link = styled('a')`
  cursor: pointer;
  display: block;
  font-family: Muli;
  font-weight: 400;
  font-size: 14px;
`

function AddToCalendar({ event }) {
  const [, { showModal, closeModal }] = useModalContext()

  return (
    <Link
      onClick={() =>
        showModal({
          name: ADD_TO_CALENDAR,
          render: () => {
            return (
              <Modal
                event={event}
                closeModal={() => closeModal({ name: ADD_TO_CALENDAR })}
              />
            )
          }
        })
      }
    >
      Add To Calendar
    </Link>
  )
}

export default AddToCalendar
