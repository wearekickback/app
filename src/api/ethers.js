import ethers from 'ethers'

export let provider
export let signer
export let getNetwork
export let getEvents

function getEthers() {
  if (!provider) {
    setupEthers()
    return ethers
  } else {
    return ethers
  }
}

function getNetwork(){
  return new Promise(function(resolve,reject){
    window.web3.version.getNetwork(function(err, result){
      resolve(result);
    });
  });
}

function getEvents(artifacts, abi){
  return new Promise(function(resolve,reject){
    getNetwork().then((networkId)=>{
      const artifact = artifacts[networkId]
      const Contract = window.web3.eth.contract(abi);
      const instance = Contract.at(artifact.address);
      const events = instance.allEvents({fromBlock: 0, toBlock: 'latest'});
      events.get(function(error, result){
        resolve(result);
      });
    })
  });
}

// export async function setupEthers(network = 'rinkeby') {
//   if (typeof window.web3 !== undefined) {
//     if (network === 'rinkeby') {
//       console.log(ethers.providers.networks)
//       ethers.providers.networks.rinkeby.ensAddress =
//         '0xe7410170f87102df0055eb195163a03b7f2bff4a'
//     }
//     // Use Mist/MetaMask's provider
//     provider = new ethers.providers.Web3Provider(
//       window.web3.currentProvider,
//       network
//     )
//     const accounts = await provider.listAccounts()
//     signer = provider.getSigner(accounts[0])
//     console.log(signer)
//   } else {
//     console.log('No web3? You should consider trying MetaMask!')
//     // Allow read-only access to the blockchain if no Mist/Metamask/EthersWallet
//     provider = ethers.providers.getDefaultProvider(network)
//   }
//   return provider
// }

export async function setupEthers(network = 'rinkeby') {
  if (typeof window.web3 !== undefined) {
    if (network === 'rinkeby') {
      console.log(ethers.providers.networks)
      ethers.providers.networks.rinkeby.ensAddress =
        '0xe7410170f87102df0055eb195163a03b7f2bff4a'
    }
    // Use Mist/MetaMask's provider
    provider = new ethers.providers.Web3Provider(
      window.web3.currentProvider,
      network
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
