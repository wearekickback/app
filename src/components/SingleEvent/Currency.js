function getTokenSymbol(tokenAddress) {
  if (tokenAddress === null) {
    return 'ETH'
  }

  if (parseInt(tokenAddress, 16) !== 0) {
    return 'DAI'
  }

  return 'ETH'
}

const Currency = ({ tokenAddress }) => {
  return `${getTokenSymbol(tokenAddress)}`
}
export default Currency
