import React, { Component } from 'react'
import styled from 'react-emotion'
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

class ConfirmModal extends Component {
  state = {
    mutationStarted: false
  }
  startMutation = () => this.setState({ mutationStarted: true })
  render() {
    const { mutation, mutationComponent, message, closeModal } = this.props
    return (
      <ConfirmModalContainer>
        <Message>{message}</Message>

        <Buttons>
          <Cancel onClick={closeModal} type="hollow">
            {this.state.mutationStarted ? 'Close' : 'Cancel'}
          </Cancel>
          {mutationComponent ? (
            <div onClick={this.startMutation}>{mutationComponent}</div>
          ) : (
            <Button
              onClick={() => {
                this.startMutation()
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
}

export default ConfirmModal
