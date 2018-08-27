import Ethers from 'ethers'
let provider

function getEthers() {
  if (!provider) {
    setupEthers('mainnet')
    return Ethers
  } else {
    return Ethers
  }
}

export { provider }

export function setupEthers(network) {
  provider = Ethers.providers.getDefaultProvider(network)
  return provider
}

export default getEthers
