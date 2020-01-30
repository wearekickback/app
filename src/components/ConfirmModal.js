import React, { useState } from 'react'
import styled from '@emotion/styled'
import Button from '../components/Forms/Button'

const ConfirmModalContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Buttons = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const Message = styled('div')`
  margin-bottom: 20px;
  line-height: 1.6em;
`

const Cancel = styled(Button)`
  margin-right: 20px;
`

const ConfirmModal = ({ mutation, mutationComponent, message, closeModal }) => {
  const [mutationStarted, setMutationStarted] = useState(false)
  const startMutation = () => setMutationStarted(true)

  return (
    <ConfirmModalContainer>
      <Message>{message}</Message>

      <Buttons>
        <Cancel onClick={closeModal} type="hollow">
          {mutationStarted ? 'Close' : 'Cancel'}
        </Cancel>
        {mutationComponent ? (
          <div onClick={startMutation}>{mutationComponent}</div>
        ) : (
          <Button
            onClick={() => {
              startMutation()
              mutation()
            }}
          >
            Confirm
          </Button>
        )}
      </Buttons>
    </ConfirmModalContainer>
  )
}

export default ConfirmModal
