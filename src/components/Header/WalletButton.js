import React, { useState } from 'react'
import styled from 'react-emotion'

import { GlobalConsumer } from '../../GlobalState'
import Button from '../Forms/Button'
import EtherScanLink from '../ExternalLinks/EtherScanLink'
import c from '../../colours'

const GuideWrapper = styled('div')`
  margin-right: 2em;
  position: relative;
  & > a,
  & > div > a {
    color: white;
  }
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
`

function WalletButton() {
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(!showMenu)
  return (
    <GlobalConsumer>
      {({ wallet, signIn, signOut, userAddress }) => {
        if (!wallet) {
          return (
            <Button type="light" onClick={signIn} analyticsId="Sign In">
              Connect to Wallet
            </Button>
          )
        }
        return (
          <GuideWrapper>
            <Button type="light" onClick={toggleMenu}>
              Connected with {wallet.name}
            </Button>

            {showMenu ? (
              <Menu>
                <List>
                  <ListItem>
                    <EtherScanLink address={userAddress}>
                      {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                    </EtherScanLink>
                  </ListItem>
                  {wallet.url && (
                    <ListItem>
                      <Link
                        href={wallet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Wallet
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
                      Disconnect Wallet
                    </Link>
                  </ListItem>
                </List>
              </Menu>
            ) : null}
          </GuideWrapper>
        )
      }}
    </GlobalConsumer>
  )
}

export default WalletButton
