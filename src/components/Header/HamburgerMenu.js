import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'
import { links } from './Guide'

const HamburgerMenuContainer = styled('div')`
  display: ${p => (p.isMenuOpen ? 'flex' : 'none')};
  background: #6e76ff;
  flex-direction: column;
  position: relative;
  padding: 0 20px 10px;

  a {
    color: white;
    padding: 10px 0;
  }
`

function HamburgerMenu({ isMenuOpen }) {
  return (
    <HamburgerMenuContainer isMenuOpen={isMenuOpen}>
      <Link to="/events">Events</Link>
      {links.map(l => (
        <Link to={l.href}>{l.label}</Link>
      ))}
    </HamburgerMenuContainer>
  )
}

export default HamburgerMenu
