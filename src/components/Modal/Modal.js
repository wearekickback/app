import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import { GlobalConsumer } from '../../GlobalState'
// import { Transition } from 'react-spring'

class Modal extends PureComponent {
  render() {
    const { name, children, component: Component } = this.props
    return (
      <GlobalConsumer>
        {({ currentModal, toggleModal }) => (
          name === currentModal &&
            (
              <ModalContainer
                show={name === currentModal}
                onClick={event => {
                  event.stopPropagation()
                  toggleModal(name)
                }}
              >
                <ModalContent onClick={event => event.stopPropagation()}>
                  <Component name={name} />
                  {children}
                </ModalContent>
              </ModalContainer>
            )
        )}
      </GlobalConsumer>
    )
  }
}

const ModalContainer = styled('div')`
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContent = styled('div')`
  background: white;
  padding: 40px;
  width: 50%;
`

export default Modal
