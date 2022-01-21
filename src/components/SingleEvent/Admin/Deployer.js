import React from 'react'
import styled from '@emotion/styled'
import { DEPLOYER_QUERY } from '../../../graphql/queries'
import Loader from '../../Loader'
import WarningBox from '../../WarningBox'
import SafeQuery from '../../SafeQuery'
const { DEPLOYER_CONTRACT_ADDRESS } = require('../../../config')

function DeployerComponent({ address }) {
  return (
    <SafeQuery query={DEPLOYER_QUERY} fetchPolicy="cache-and-network">
      {({ data, loading }) => {
        console.log('*****DEPLOYER', {
          DEPLOYER_CONTRACT_ADDRESS,
          data
        })
        // no party?
        if (!data) {
          if (loading) {
            return <Loader />
          } else {
            return <WarningBox>{address}!</WarningBox>
          }
        }
        return <></>
      }}
    </SafeQuery>
  )
}

export default DeployerComponent
