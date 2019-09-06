import React from 'react'
import styled from 'react-emotion'

const ErrorDiv = styled('div')`
  padding: ${p => (p.padding ? `0 20px` : ``)};
  display: flex;
  justify-content: flex-start;
  max-width: 1200px;
  margin: 0 auto 20px;
`

function getStylesBasedOnWarningLevel(warningLevel) {
  console.log(warningLevel)
  switch (warningLevel) {
    case 'high':
      return `
        background: hsla(360, 88%, 62%, 0.9);
      `
    case 'medium':
      return `
        background: #ffac32;
      `
  }
}

const Inner = styled('div')`
  width: 100%;
  ${p => getStylesBasedOnWarningLevel(p.warningLevel)}
  color: #fff;
  padding: 20px 25px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.7em;
  justify-content: flex-start;

  a {
    color: white;
    text-decoration: underline;
    &:visited: {
      color: white;
    }
  }
`

export default ({ children, warningLevel = 'high', padding }) => (
  <ErrorDiv padding={padding}>
    <Inner warningLevel={warningLevel}>{children}</Inner>
  </ErrorDiv>
)
