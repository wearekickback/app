import ethers from 'ethers'

export let provider
export let signer

function getEthers() {
  if (!provider) {
    setupEthers()
    return ethers
  } else {
    return ethers
  }
}

export function setupEthers(network = 'rinkeby') {
  if (typeof window.web3 !== undefined) {
    // Use Mist/MetaMask's provider
    provider = new ethers.providers.Web3Provider(
      window.web3.currentProvider,
      network
    )
    signer = provider.getSigner()
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // Allow read-only access to the blockchain if no Mist/Metamask/EthersWallet
    provider = ethers.providers.getDefaultProvider(network)
  }
  return provider
}

export default getEthers
