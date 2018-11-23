import React, { Component } from "react"
import styled from "react-emotion"
import { GlobalConsumer } from "../../GlobalState"

class ToggleModal extends Component {
  render() {
    const { className, children, modalName, modalRender } = this.props
    return (
      <GlobalConsumer>
        {({ toggleModal }) => (
          <ToggleModalContainer
            className={className}
            onClick={() => toggleModal(modalName, modalRender)}
          >
            {children}
          </ToggleModalContainer>
        )}
      </GlobalConsumer>
    )
  }
}

const ToggleModalContainer = styled("div")`
  &:hover {
    cursor: pointer;
  }
`

export default ToggleModal
