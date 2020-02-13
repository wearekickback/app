import React, { useContext } from 'react'
import styled from '@emotion/styled'

import GlobalContext from '../../../GlobalState'
import { ADD_TO_CALENDAR } from '../../../modals'
import Modal from './Modal'

const Link = styled('a')`
  cursor: pointer;
  display: block;
  font-family: Muli;
  font-weight: 400;
  font-size: 14px;
`

function AddToCalendar({ event }) {
  const { showModal, closeModal } = useContext(GlobalContext)

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
