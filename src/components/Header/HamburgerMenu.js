import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { links } from './Guide'
import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'
import SignInButton from './SignInButton'
import TrackedLink from '../Links/TrackedLink'

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
      <SignInButton />
      <GlobalConsumer>
        {({ wallet, signIn, signOut, loggedIn, userProfile }) => {
          if (!wallet) {
            return (
              <Button type="light" onClick={signIn} analyticsId="Sign In">
                Connect Kickback to Wallet
              </Button>
            )
          }
          return (
            <>
              {wallet.url && (
                <TrackedLink
                  to={wallet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {wallet.name} Wallet
                </TrackedLink>
              )}
              {loggedIn && userProfile && (
                <Link to={`/user/${userProfile.username}`}>
                  Kickback Profile
                </Link>
              )}
              {wallet.type === 'sdk' && wallet.dashboard && (
                <Link onClick={wallet.dashboard}>{wallet.name} Dashboard</Link>
              )}
              <Link to="#" onClick={signOut}>
                Switch Wallet
              </Link>
            </>
          )
        }}
      </GlobalConsumer>
      <Link to="/events">Events</Link>
      <Link to="/pricing">Pricing</Link>
      {links.map(l => (
        <TrackedLink to={l.href}>{l.label}</TrackedLink>
      ))}
    </HamburgerMenuContainer>
  )
}

export default HamburgerMenu
