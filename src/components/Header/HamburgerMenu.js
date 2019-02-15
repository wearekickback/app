import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'react-emotion'
import { links } from './Guide'

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
