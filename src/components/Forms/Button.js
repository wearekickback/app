import React, { PureComponent } from 'react'
import styled from 'react-emotion'

import { track } from '../../api/analytics'

function getButtonStyles(type) {
  switch (type) {
    case 'light':
      return `
        color: #6e76ff;
        background-color: white;
        &:hover {
          background-color:rgba(233,234,255,0.75);
        }
      `
    case 'hollow':
      return `
        color: #5D64DE;
        background-color: transparent;
        &:hover {
          background-color:rgba(233,234,255,0.75);
        }
      `
    case 'disabled':
      return `
        color: #BCBDC5;
        background-color: #EDEEF4;
        border: 1px solid #EDEEF4;
        &:hover {
          cursor: default;
          color: #BCBDC5;
          background-color: #EDEEF4;
          border: 1px solid #EDEEF4;
        }
      `
    default:
      return ''
  }
}

function DefaultButtonStyles() {
  return `
    background-color: #6e76ff;
    border-radius: 4px;
    border: 1px solid #6e76ff;
    font-size: 14px;
    font-family: Muli;
    padding: 10px 20px;
    color: white;
    transition: 0.2s ease-out;

    &:hover {
      cursor: pointer;
      background-color: #5d64de;
      border: 1px solid #5d64de;
    }

    &:active {
      background-color: #4c54d3;
      border: 1px solid #4c54d3;
    }

    &:focus {
      outline: 0;
    }
  `
}

const ButtonContainer = styled('button')`
  ${props => DefaultButtonStyles(props)} ${({ wide }) =>
    wide ? 'width: 100%;' : ''};
  ${({ twoThirds }) => (twoThirds ? 'width: 66%;' : '')};
  ${({ type }) => getButtonStyles(type)};
`

const Link = styled('a')`
  ${props => DefaultButtonStyles(props)} ${({ wide }) =>
    wide ? 'width: 100%;' : ''};
  ${({ twoThirds }) => (twoThirds ? 'width: 66%;' : '')};
`

export class ButtonLink extends PureComponent {
  _onClick = () => {
    track(`Click: ${this.props.analyticsId}`)
  }

  render() {
    const { children, ...props } = this.props

    return (
      <Link onClick={this._onClick} {...props}>
        {children}
      </Link>
    )
  }
}

export default class Button extends PureComponent {
  _onClick = () => {
    track(`Click: ${this.props.analyticsId}`)

    this.props.onClick && this.props.onClick()
  }

  render() {
    const { children, ...props } = this.props

    props.type = props.disabled ? 'disabled' : props.type

    const disabled = props.type === 'disabled'

    return (
      <ButtonContainer {...props} onClick={disabled ? null : this._onClick}>
        {children}
      </ButtonContainer>
    )
  }
}
