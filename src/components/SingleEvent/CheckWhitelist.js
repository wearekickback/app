import { useQuery } from 'react-apollo'
import { GET_MAINNET_TOKEN_BALANCE } from '../../graphql/queries'

const CheckWhitelist = function({ userAddresses, tokenAddress, children }) {
  const { loading, error, data } = useQuery(GET_MAINNET_TOKEN_BALANCE, {
    variables: {
      userAddresses,
      tokenAddress
    }
  })
  if (loading) return 'loading'
  return children(data)
}

export default CheckWhitelist
