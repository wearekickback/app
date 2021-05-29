import React, { useState } from 'react'
import { Link as ReactLink } from 'react-router-dom'
import styled from '@emotion/styled'
import mq from '../../mediaQuery'

import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'
import UserProfileButton from './UserProfileButton'
import EtherScanLink from '../Links/EtherScanLink'
import AddressLink from '../Links/AddressLink'
import c from '../../colours'

const WalletWrapper = styled('div')`
  margin-right: 2em;
  position: relative;
`

const Menu = styled('div')`
  position: absolute;
  border-radius: 6px;
  background: #f4f5ff;
  box-shadow: 0 4px 6px hsla(0, 0%, 0%, 0.1);
  white-space: nowrap;
  top: 100%;
  transform: translateY(10px);
`

const List = styled('ul')`
  list-style-type: none;
  margin: 0;
  & li:not(:first-child) {
    border-top: #eee solid 1px;
  }
`

const ListItem = styled('li')`
  padding: 10px 20px;
`

const Link = styled('a')`
  color: ${c.primary400};
  cursor: pointer;
`

const CTAButton = styled(Button)`
  min-width: 200px;
  font-weight: bold;
  width: 100%;
  ${mq.small`
    width: auto;
  `};
`

function WalletButton() {
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(!showMenu)
  return (
    <GlobalConsumer>
      {({ wallet, signIn, signOut, userAddress, loggedIn, userProfile }) => {
        if (!wallet) {
          return (
            <CTAButton type="light" onClick={signIn} analyticsId="Sign In">
              Connect Kickback to Wallet
            </CTAButton>
          )
        }

        return (
          <WalletWrapper>
            <CTAButton type="light" onClick={toggleMenu}>
              {loggedIn && userProfile ? (
                <UserProfileButton userProfile={userProfile} />
              ) : (
                <>Manage your wallet</>
              )}
            </CTAButton>
            {showMenu ? (
              <Menu>
                <List>
                  {userAddress && (
                    <ListItem>
                      <AddressLink userAddress={userAddress} />
                    </ListItem>
                  )}
                  {loggedIn && userProfile && (
                    <ListItem>
                      <ReactLink to={`/user/${userProfile.username}`}>
                        Kickback Profile
                      </ReactLink>
                    </ListItem>
                  )}
                  {wallet.type === 'sdk' && wallet.dashboard && (
                    <ListItem>
                      <Link onClick={wallet.dashboard}>
                        {wallet.name} Dashboard
                      </Link>
                    </ListItem>
                  )}
                  {wallet.dashboard && wallet.url && (
                    <ListItem>
                      <Link
                        href={wallet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {wallet.name} Wallet
                      </Link>
                    </ListItem>
                  )}
                  <ListItem>
                    <Link
                      href="#"
                      onClick={() => {
                        setShowMenu(false)
                        signOut()
                      }}
                    >
                      Switch Wallet
                    </Link>
                  </ListItem>
                </List>
              </Menu>
            ) : null}
          </WalletWrapper>
        )
      }}
    </GlobalConsumer>
  )
}

export default WalletButton
