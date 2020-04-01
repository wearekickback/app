import React from 'react'
import styled from '@emotion/styled'
import TrackedLink from '../Links/TrackedLink'

import LogoIconDefault from './Logo'

const Link = styled(TrackedLink)`
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
