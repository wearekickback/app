import React, { Component } from 'react'
import styled from 'react-emotion'
import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'

const StyledButton = styled(Button)`
  background: none;
  border: none;
  &:hover {
    background: none;
    border: none;
  }
`

class WyreButton extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <GlobalConsumer>
        {({ loggedIn }) => {
          console.log('loggedIn: ', loggedIn)
          return loggedIn ? <StyledButton>Buy Crypto</StyledButton> : null
        }}
      </GlobalConsumer>
    )
  }
}

export default WyreButton
