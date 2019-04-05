import React from 'react'
import styled from 'react-emotion'

import { GlobalConsumer } from '../../GlobalState'

const Link = styled('a')`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const EtherScanLink = ({ address, tx, children }) => (
  <GlobalConsumer>
    {({ networkState: { expectedNetworkName, expectedNetworkId } }) => {
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
