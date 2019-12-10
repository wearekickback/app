import { Deployer } from '@wearekickback/contracts'
import Web3 from 'web3'
import EventEmitter from 'eventemitter3'

import { DEPLOYER_CONTRACT_ADDRESS, DAI_CONTRACT_ADDRESS } from '../config'
import { getProvider } from '../GlobalState'
import { NEW_BLOCK } from '../utils/events'
import { clientInstance } from '../graphql'
import { NETWORK_ID_QUERY } from '../graphql/queries'
import { Authereum } from 'authereum'

let web3
let web3WalletSelection

let networkState = {}
let localEndpoint = false

export const events = new EventEmitter()

export const isLocalEndpoint = () => localEndpoint

const updateGlobalState = () => {
  getProvider().then(provider => {
    provider.setNetworkState({ ...networkState, resolved: true })
  })
}

const getNetworkName = id => {
  switch (id) {
    case '1':
      return 'Mainnet'
    case '3':
      return 'Ropsten'
    case '4':
      return 'Rinkeby'
    case '42':
      return `Kovan`

    default:
      return 'Local/Private'
  }
}

const getNetworkProviderUrl = id => {
  switch (id) {
    case '1':
      return `https://mainnet.infura.io/`
    case '3':
      return `https://ropsten.infura.io/`
    case '4':
      return `https://rinkeby.infura.io/`
    case '42':
      return `https://kovan.infura.io/`

    default:
      throw new Error(`Cannot connect to unsupported network: ${id}`)
  }
}

const isLocalNetwork = id => {
  switch (id) {
    case '1':
    case '3':
    case '4':
      return false
    default:
      return true
  }
}

const getWeb3 = async () => {
  const walletSelection = window.sessionStorage.getItem('walletSelection')

  // If cached web3 doesn't exist or wallet sellection has changed, get web3
  if (web3WalletSelection !== walletSelection) {
    web3WalletSelection = walletSelection

    try {
      networkState = { allGood: true }
      const result = await clientInstance.query({
        query: NETWORK_ID_QUERY
      })

      if (result.error) {
        throw new Error(result.error)
      }
      networkState.expectedNetworkId = result.data.networkId
      networkState.expectedNetworkName = getNetworkName(
        networkState.expectedNetworkId
      )

      if (walletSelection === 'authereum') {
        const authereum = new Authereum(
          networkState.expectedNetworkName.toLowerCase()
        )
        const authereumProvider = authereum.getProvider()
        web3 = new Web3(authereumProvider)
      } else if (window.ethereum) {
        web3 = new Web3(window.ethereum)
      } else if (window.web3 && window.web3.currentProvider) {
        web3 = new Web3(window.web3.currentProvider)
        networkState.readOnly = false
      } else {
        //local node
        const url = 'http://localhost:8545'

        try {
          await fetch(url)
          localEndpoint = true
          web3 = new Web3(new Web3.providers.HttpProvider(url))
        } catch (err) {
          web3 = new Web3(getNetworkProviderUrl(networkState.expectedNetworkId))
          networkState.readOnly = true
        }
      }
      networkState.networkId = `${await web3.eth.net.getId()}`
      networkState.networkName = getNetworkName(networkState.networkId)

      // Override these values to handle contract-based-accounts
      networkState.networkName = networkState.expectedNetworkName
      networkState.networkId = networkState.expectedNetworkId

      networkState.isLocalNetwork = isLocalNetwork(networkState.networkId)
      if (networkState.networkId !== networkState.expectedNetworkId) {
        networkState.wrongNetwork = true
        networkState.allGood = false
      }
      // if web3 not set then something failed
      if (!web3) {
        networkState.allGood = false
        throw new Error('Error setting up web3')
      }

      // poll for blocks
      setInterval(async () => {
        try {
          const block = await web3.eth.getBlock('latest')
          events.emit(NEW_BLOCK, block)
        } catch (__) {
          /* nothing to do */
        }
      }, 1000)
      networkState.networkId = `${await web3.eth.net.getId()}`
      networkState.networkName = getNetworkName(networkState.networkId)
      networkState.isLocalNetwork = isLocalNetwork(networkState.networkId)
      if (networkState.networkId !== networkState.expectedNetworkId) {
        networkState.wrongNetwork = true
        networkState.allGood = false
      }
      // if web3 not set then something failed
      if (!web3) {
        networkState.allGood = false
        throw new Error('Error setting up web3')
      }

      // poll for blocks
      setInterval(async () => {
        try {
          const block = await web3.eth.getBlock('latest')
          events.emit(NEW_BLOCK, block)
        } catch (__) {
          /* nothing to do */
        }
      }, 10000)
    } catch (err) {
      console.warn(err)
      web3 = null
    } finally {
      // update global state with current network state
      updateGlobalState()
    }
  }
  return web3
}

export async function getDeployerAddress() {
  // if local env doesn't specify address then assume we're on a public net
  return (
    DEPLOYER_CONTRACT_ADDRESS ||
    Deployer.networks[networkState.expectedNetworkId].address
  )
}

export async function getTokenBySymbol(symbol) {
  if (symbol === 'DAI') {
    switch (networkState.expectedNetworkId) {
      case '1':
        return '0x6b175474e89094c44da98b954eedeac495271d0f'
      // These are all fake DAI which anyone can mint
      // https://twitter.com/PaulRBerg/status/1198276650884124674
      // Ropsten
      // https://twitter.com/PaulRBerg/status/1198276655816548354
      case '3':
        return '0x2d69ad895797c880abce92437788047ba0eb7ff6'
      // Rinkeby
      // https://twitter.com/PaulRBerg/status/1198276654566723584
      case '4':
        return '0xc3dbf84abb494ce5199d5d4d815b10ec29529ff8'
      // Kovan
      // https://twitter.com/PaulRBerg/status/1198276653312548865
      case '42':
        return '0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9'
      default:
        return DAI_CONTRACT_ADDRESS
    }
  } else if ('SAI') {
    switch (networkState.expectedNetworkId) {
      case '1':
        return '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
      case '3':
        return '' // TODO
      case '4':
        return '' // TODO
      case '42':
        return '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
      default:
        return DAI_CONTRACT_ADDRESS
    }
  }
}

export async function getTransactionReceipt(txHash) {
  try {
    const web3 = await getWeb3()
    return web3.eth.getTransactionReceipt(txHash)
  } catch (_) {
    return null
  }
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

export async function getAccount() {
  let accountIndex = 0
  /* Query params account switch for testing */
  if (localEndpoint === true) {
    const query = window.location.search
    const params = new URLSearchParams(query)
    const account = params.get('account')
    if (account) {
      accountIndex = account
    }
  }
  try {
    const accounts = await web3.eth.getAccounts()

    if (accounts.length > 0) {
      return accounts[accountIndex]
    } else {
      try {
        const accounts = await window.ethereum.send('eth_requestAccounts')
        return accounts[accountIndex]
      } catch (error) {
        console.warn('Did not allow app to access dapp browser')
        throw error
      }
    }
  } catch (_) {
    return null
  }
}

export default getWeb3
