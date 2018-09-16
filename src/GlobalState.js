import React, { createContext, Component } from 'react'

const GlobalContext = createContext({})
const GlobalConsumer = GlobalContext.Consumer

export class GlobalProvider extends Component {
  state = {
    currentModal: null
  }
  handleModalToggle = modal => {
    this.setState(state => {
      if (state.currentModal === modal) {
        return {
          currentModal: null
        }
      } else {
        return {
          currentModal: modal
        }
      }
    })
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          state: this.state,
          handleModalToggle: this.handleModalToggle
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

export default GlobalConsumer
