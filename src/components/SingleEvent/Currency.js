const SAIS = [
  '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
]

function getTokenSymbol(tokenAddress) {
  if (tokenAddress === null) {
    return 'ETH'
  }

  if (parseInt(tokenAddress, 16) !== 0) {
    if (SAIS.includes(tokenAddress)) return 'SAI'
    else {
      return 'DAI'
    }
  }

  return 'ETH'
}

const Currency = ({ tokenAddress }) => {
  return `${getTokenSymbol(tokenAddress)}`
}
export default Currency
