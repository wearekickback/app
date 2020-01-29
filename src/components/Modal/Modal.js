import React from 'react'
import styled from 'react-emotion'
import mq from '../../mediaQuery'
import { useModalContext } from '../../contexts/ModalContext'

const Modal = props => {
  const [{ currentModal }, { closeModal }] = useModalContext()
  const { small, name, children, component: Component } = props

  if (!currentModal || name !== currentModal.name) {
    return null
  }
  return (
    <ModalContainer
      show={name === currentModal.name}
      onClick={event => {
        event.stopPropagation()
        closeModal({ name })
      }}
    >
      <ModalContent onClick={event => event.stopPropagation()} small={small}>
        {Component ? (
          <Component name={name} />
        ) : currentModal.render ? (
          currentModal.render({
            ...props,
            closeModal: () => {
              closeModal({ name })
            }
          })
        ) : null}
        {children}
      </ModalContent>
    </ModalContainer>
  )
}

const ModalContainer = styled('div')`
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`

const ModalContent = styled('div')`
  background: white;
  padding: 40px;
  width: 100%;
  overflow-y: scroll;
  max-height: 100%;
  border-radius: 6px;
  ${mq.medium`
    width: 70%;
  `};

  ${mq.large`
    width: 50%;
  `};

  ${p =>
    p.small
      ? `
    height: auto;
    width: auto;
  `
      : null};
`

export default Modal
