import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import mq, { useMediaMin, useMediaMax } from '../mediaQuery'

import Logo from '../components/Icons/LogoFull'
import GuideDropdown from '../components/Header/Guide'
import WalletButton from '../components/Header/WalletButton'
import SignInButton from '../components/Header/SignInButton'
import Hamburger from '../components/Header/Hamburger'
import HamburgerMenu from '../components/Header/HamburgerMenu'
import { GlobalConsumer } from '../GlobalState'
import SafeQuery from '../components/SafeQuery'
import { IS_WHITELISTED } from '../graphql/queries'

import Banner from './Banner'

const HeaderContainer = styled('header')`
  width: 100%;
  height: 70px;
  background: #6e76ff;
  margin-bottom: 50px;
  ${p => p.noMargin && 'margin-bottom: 0;'}
  ${p => p.noBackground && 'background: 0;'}
  ${p =>
    p.positionAbsolute &&
    `
    position: absolute;
    left: 0;
    top: 0;
  `}
`

const HeaderInner = styled('div')`
  margin: 0 auto 0;
  padding: 0 20px;
  max-width: 1200px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${p =>
    p.positionAbsolute &&
    mq.xLarge`
    padding: 50px 20px;
  `}
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

function Header({ noMargin, noBackground, positionAbsolute }) {
  const [open, setOpen] = useState(false)
  const isMinMedium = useMediaMin('medium')
  const isMaxMedium = useMediaMax('medium')
  return (
    <GlobalConsumer>
      {({ userAddress }) => {
        return (
          <SafeQuery
            query={IS_WHITELISTED}
            variables={{ address: userAddress || '' }}
          >
            {({ data: { isWhitelisted } }) => {
              return (
                <>
                  <Banner />
                  <HeaderContainer
                    noMargin={noMargin}
                    noBackground={noBackground}
                    positionAbsolute={positionAbsolute}
                  >
                    <HeaderInner positionAbsolute={positionAbsolute}>
                      <Logo />
                      {isMinMedium && (
                        <RightBar>
                          {isWhitelisted ? (
                            <NavLink to="/create">Create Event</NavLink>
                          ) : (
                            ''
                          )}
                          <NavLink to="/events">Events</NavLink>
                          <NavLink to="/pricing">Pricing</NavLink>
                          <GuideDropdown />
                          <WalletButton />
                          <SignInButton />
                        </RightBar>
                      )}

                      {isMaxMedium && (
                        <Hamburger
                          isMenuOpen={open}
                          toggleOpen={() => setOpen(!open)}
                        />
                      )}
                    </HeaderInner>
                    {isMaxMedium && <HamburgerMenu isMenuOpen={open} />}
                  </HeaderContainer>
                </>
              )
            }}
          </SafeQuery>
        )
      }}
    </GlobalConsumer>
  )
}

export default Header
