import React, { Component } from 'react'
import styled from 'react-emotion'
import { CONFIRM_TRANSACTION } from '../modals'
import Button from '../components/Forms/Button'

const ConfirmModalContainer = styled('div')``

class ConfirmModal extends Component {
  render() {
    const { mutation, message, toggleModal } = this.props
    return (
      <ConfirmModalContainer>
        {message}
        <Button>Cancel</Button>
        <Button
          onClick={() => {
            mutation()
            toggleModal({ name: CONFIRM_TRANSACTION })
          }}
        >
          Confirm
        </Button>
      </ConfirmModalContainer>
    )
  }
}

export default ConfirmModal
