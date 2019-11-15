import React from 'react'
import styled from 'react-emotion'

const Dots = styled('div')`
  padding-right: 1em;

  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 0.5em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

export default props => {
  return <Dots>{props.children}</Dots>
}
