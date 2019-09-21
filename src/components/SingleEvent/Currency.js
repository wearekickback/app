function getTokenSymbol(tokenAddress) {
  if (parseInt(tokenAddress, 16) !== 0) {
    return 'DAI'
  }

  return 'ETH'
}

const Currency = ({ tokenAddress }) => {
  return `${getTokenSymbol(tokenAddress)}`
}
export default Currency
