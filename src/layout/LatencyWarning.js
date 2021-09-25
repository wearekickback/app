import React from 'react'
import moment from 'moment'
import styled from '@emotion/styled'
import { GET_BLOCK, GET_GRAPH_BLOCK } from '../graphql/queries'
import { useQuery } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

const LatencyWarningContainer = styled('div')`
  padding: 20px 20px;
  text-align: center;
  background: #ffac32;
  color: white;
`

const graphClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/wearekickback/kickbackpolygon'
  })
})

export default function LatencyWarning() {
  const { data: graphData } = useQuery(GET_GRAPH_BLOCK, {
    client: graphClient
  })
  const graphBlockNumber =
    graphData &&
    graphData.block &&
    graphData.block.block &&
    graphData.block.block.number
  const { data: currentBlock } = useQuery(GET_BLOCK)
  const { data: graphBlock } = useQuery(GET_BLOCK, {
    variables: { number: graphBlockNumber },
    skip: !graphBlockNumber
  })
  const currentTime =
    currentBlock &&
    currentBlock.getBlock &&
    moment(currentBlock.getBlock.timestamp * 1000)
  const graphTime =
    graphBlock &&
    graphBlock.getBlock &&
    moment(graphBlock.getBlock.timestamp * 1000)
  if (!(currentTime && graphTime)) return ''
  const diff = currentTime.diff(graphTime, 'minutes')
  const currentTimeToDisplay = currentTime.format('DD/MM/YYYY HH:mm:ss')
  const graphTimeToDisplay = graphTime.format('DD/MM/YYYY HH:mm:ss')
  console.log('***', { currentTimeToDisplay, graphTimeToDisplay, diff })
  if (diff < 1) return ''
  return (
    <LatencyWarningContainer>
      There is curreently {diff} min delay between blockchain (
      {currentTimeToDisplay}) and our system ({graphTimeToDisplay}). Please be
      paient as it will take a while for the latest state to appear on the site.
    </LatencyWarningContainer>
  )
}
