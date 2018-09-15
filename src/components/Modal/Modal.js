import React, { Component } from 'react'
import styled from 'react-emotion'
import GlobalConsumer from '../../GlobalState'

class Modal extends Component {
  render() {
    const { name, children } = this.props
    return (
      <GlobalConsumer>
        {({ state }) => (
          <ModalContainer show={name === state.currentModal}>
            {children}
          </ModalContainer>
        )}
      </GlobalConsumer>
    )
  }
}

const ModalContainer = styled('div')`
  display: ${({ show }) => (show ? 'block' : 'none')};
`

export default Modal
