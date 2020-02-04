import React from 'react'
import styled from 'react-emotion'

import { GlobalConsumer } from '../../GlobalState'
import c from '../../colours'

const Link = styled('a')`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${c.primary400};
`

const EtherScanLink = ({ address, tx, children }) => (
  <GlobalConsumer>
    {({ networkState: { expectedNetworkName, expectedNetworkId } }) => {
      // If network state is unknown then just print the data
      if (!expectedNetworkId || !expectedNetworkName) {
        if (address) {
          return address
        } else if (tx) {
          return tx
        }
      }

      const prefix =
        '1' === expectedNetworkId ? '' : `${expectedNetworkName.toLowerCase()}.`

      let link
      if (address) {
        link = `https://${prefix}etherscan.io/address/${address}`
      } else if (tx) {
        link = `https://${prefix}etherscan.io/tx/${tx}`
      }
      return link ? (
        <Link target="_blank" href={link}>
          {children}
        </Link>
      ) : null
    }}
  </GlobalConsumer>
)

export default EtherScanLink
