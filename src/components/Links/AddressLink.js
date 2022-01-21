import React from 'react'
import styled from '@emotion/styled'
import { ENS_NAME_QUERY } from '../../graphql/queries'
import { useQuery } from 'react-apollo'
import EtherScanLink from '../Links/EtherScanLink'

const AddressLink = ({ userAddress, prefix = '' }) => {
  const { data: ensData } = useQuery(ENS_NAME_QUERY, {
    variables: { userAddress }
  })

  const ensName =
    ensData &&
    ensData.getEnsName &&
    ensData.getEnsName.name &&
    ensData.getEnsName.name[0]

  return (
    <EtherScanLink address={userAddress}>
      {ensName
        ? `${prefix}${ensName}`
        : `${prefix}${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
    </EtherScanLink>
  )
}

export default AddressLink
