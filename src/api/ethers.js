import ethers from 'ethers'

export let provider
export let signer

const networks = {
  '1': 'homestead',
  '3': 'ropsten',
  '4': 'rinkeby'
}

function getEthers() {
  if (!provider) {
    setupEthers()
    return ethers
  } else {
    return ethers
  }
}

function getNetwork(web3) {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((err, id) => {
      if (err) {
        reject(err)
      }
      resolve(id)
    })
  })
}

export async function setupEthers(network) {
  if (typeof window.web3 !== undefined) {
    const id = await getNetwork(window.web3)

    if (networks[id] === 'rinkeby') {
      ethers.providers.networks.rinkeby.ensAddress =
        '0xe7410170f87102df0055eb195163a03b7f2bff4a'
    }

    console.log(typeof id)

    console.log(id[networks])

    // Use Mist/MetaMask's provider
    provider = new ethers.providers.Web3Provider(
      window.web3.currentProvider,
      networks[id]
    )
    const accounts = await provider.listAccounts()
    signer = provider.getSigner(accounts[0])
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // Allow read-only access to the blockchain if no Mist/Metamask/EthersWallet
    provider = ethers.providers.getDefaultProvider(network)
  }
  return provider
}

export default getEthers
