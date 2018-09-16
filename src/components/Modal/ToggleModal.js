import React, { Component } from 'react'
import styled from 'react-emotion'
import GlobalConsumer from '../../GlobalState'

class ToggleModal extends Component {
  render() {
    const { className, children, modalName } = this.props
    return (
      <GlobalConsumer>
        {({ handleModalToggle }) => (
          <ToggleModalContainer
            className={className}
            onClick={() => handleModalToggle(modalName)}
          >
            {children}
          </ToggleModalContainer>
        )}
      </GlobalConsumer>
    )
  }
}

const ToggleModalContainer = styled('div')``

export default ToggleModal
