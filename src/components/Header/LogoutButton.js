import React, { Component } from 'react'
import styled from 'react-emotion'
import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'

const StyledButton = styled(Button)`
  background: none;
  border: none;
  font-size: 16px;
  &:hover {
    background: none;
    border: none;
  }
  @media (max-width: 576px) {
    padding: 0px;
    text-align: left;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`

class WyreButton extends Component {
  render() {
    return (
      <GlobalConsumer>
        {({ loggedIn }) => {
          console.log('loggedIn: ', loggedIn)
          return loggedIn ? <StyledButton>Logout</StyledButton> : null
        }}
      </GlobalConsumer>
    )
  }
}

export default WyreButton
