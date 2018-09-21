import ethers from 'ethers'
import { Deployer } from '@noblocknoparty/contracts'
import { promisify } from 'es6-promisify'

import { DEPLOYER_CONTRACT_ADDRESS, NETWORK } from '../config'

export let provider = null
export let signer
export let networkError
let networkId

const NETWORKS = {
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

export async function getDeployerAddress() {
  // if local env doesn't specify address then assume we're on a public net
  return (
    DEPLOYER_CONTRACT_ADDRESS || Deployer.NETWORKS[networkId].address
  )
}

export async function getTransactionLogs(txHash) {
  const { logs } = await provider.getTransactionReceipt(txHash)

  return logs
}

export async function getEvents(address, abi) {
  return new Promise(function(resolve, reject) {
    const Contract = window.web3.eth.contract(abi)
    const instance = Contract.at(address)
    const events = instance.allEvents({ fromBlock: 0, toBlock: 'latest' })
    events.get(function(error, result) {
      if (error) {
        reject(error)
      }

      resolve(result)
    })
  })
}

export async function setupEthers() {
  const expectedNetwork = NETWORK

  if (expectedNetwork === 'rinkeby') {
    ethers.providers.NETWORKS.rinkeby.ensAddress =
      '0xe7410170f87102df0055eb195163a03b7f2bff4a'
  }

  // try and connect via web3
  if (window.web3 && window.web3.currentProvider) {
    try {
      const id = await promisify(window.web3.version.getNetwork.bind(window.web3.version))()

      if (expectedNetwork && NETWORKS[id] !== expectedNetwork) {
        throw new Error(`Not on expected network: ${expectedNetwork}`)
      }

      // Use Mist/MetaMask's provider
      provider = new ethers.providers.Web3Provider(
        window.web3.currentProvider,
        expectedNetwork
      )

      const [ account ] = await provider.listAccounts()

      console.log(`Signer account: ${account}`)

      signer = provider.getSigner(account)
    } catch (err) {
      console.warn(`Unable to connect via Web3 provider`, err)
    }
  } else {
    console.log('No web3? You should consider trying MetaMask!')
  }

  if (!provider) {
    try {
      // Allow read-only access to the blockchain if no Mist/Metamask/EthersWallet
      provider = ethers.providers.getDefaultProvider(expectedNetwork)

      // check that it works!
      await provider.getBlockNumber()
    } catch (err) {
      networkError = `We were unable to connect to the Ethereum network: ${expectedNetwork || 'local'}`

      return console.error(networkError)
    }
  }

  networkId = provider.chainId
}

export default getEthers
