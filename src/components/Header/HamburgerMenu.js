import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'
import { links } from './Guide'
import SignInButton from './SignInButton'

const HamburgerMenuContainer = styled('div')`
  display: flex;
  background: #6e76ff;
  flex-direction: column;
  position: relative;
  padding: ${p => (p.isMenuOpen ? '0 20px 10px;' : '0 20px 0 ')};
  transition: 0.5s;
  max-height: ${p => (p.isMenuOpen ? '500px' : '0')};
  overflow: hidden;
  a {
    color: white;
    padding: 10px 0;
  }
`

function isExternal(url) {
  return /^https/.test(url)
}

function HamburgerMenu({ isMenuOpen }) {
  return (
    <HamburgerMenuContainer isMenuOpen={isMenuOpen}>
      <SignInButton />
      <Link to="/events">Events</Link>
      <Link to="/pricing">Pricing</Link>
      {links.map(l =>
        isExternal(l.url) ? (
          <Link to={l.href}>{l.label}</Link>
        ) : (
          <a href={l.href}>{l.label}</a>
        )
      )}
    </HamburgerMenuContainer>
  )
}

export default HamburgerMenu
