import React from 'react'
import styled from 'react-emotion'
import { Link as DefaultLink } from 'react-router-dom'

import LogoIconDefault from './Logo'

const Link = styled(DefaultLink)`
  display: flex;
  align-items: center;
`

const LogoIcon = styled(LogoIconDefault)`
  margin-right: 5px;
`

const LogoContainer = styled('h1')`
  margin: 0;
  font-size: 22px;

  a {
    font-family: Muli;
    color: white;
  }
`
const Logo = () => (
  <LogoContainer>
    <Link to="/">
      <LogoIcon />
      Kickback
    </Link>
  </LogoContainer>
)

export default Logo
