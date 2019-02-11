import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import { useMediaMin, useMediaMax } from '../mediaQuery'

import Logo from '../components/Icons/LogoFull'
import Dropdown from '../components/Header/Dropdown'
import SignInButton from '../components/Header/SignInButton'

const HeaderContainer = styled('header')`
  width: 100%;
  height: 70px;
  background: #6e76ff;
  margin-bottom: 50px;
  padding: 0 20px;
`

const HeaderInner = styled('div')`
  margin: 0 auto 0;
  max-width: 1200px;
  height: 100%;
  display: flex;
  background: #6e76ff;
  justify-content: space-between;
  align-items: center;
`

const RightBar = styled('div')`
  display: flex;
  align-items: center;
`
// const Notifications = styled('div')`
//   color: white;
//   margin-right: 20px;
// `

const NavLink = styled(Link)`
  color: white;
  margin-right: 30px;
`

function Header() {
  const isMinMedium = useMediaMin('medium')
  const isMaxMedium = useMediaMax('medium')
  return (
    <HeaderContainer>
      <HeaderInner>
        <Logo />
        {isMinMedium && (
          <RightBar>
            <Dropdown />
            <NavLink to="/events">Events</NavLink>
            <SignInButton />
          </RightBar>
        )}

        {isMaxMedium && <div>hamburger!</div>}
      </HeaderInner>
    </HeaderContainer>
  )
}

export default Header
