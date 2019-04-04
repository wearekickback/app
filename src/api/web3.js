import { Deployer } from '@wearekickback/contracts'
import Web3 from 'web3'
import EventEmitter from 'eventemitter3'

import { DEPLOYER_CONTRACT_ADDRESS } from '../config'
import { getProvider } from '../GlobalState'
import { NEW_BLOCK } from '../utils/events'
import { clientInstance } from '../graphql'
import { NETWORK_ID_QUERY } from '../graphql/queries'

let web3
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

async function getWeb3() {
  if (!web3) {
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
      if (window.ethereum) {
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
        } catch (error) {
          if (
            error.readyState === 4 &&
            (error.status === 400 || error.status === 200)
          ) {
            localEndpoint = true
            web3 = new Web3(new Web3.providers.HttpProvider(url))
          } else {
            web3 = new Web3(
              getNetworkProviderUrl(networkState.expectedNetworkId)
            )
            networkState.readOnly = true
          }
        } finally {
          if (web3 && localEndpoint) {
            console.log('Success: Local node active')
          } else if (web3) {
            console.log('Success: Cloud node active')
          }
        }
      }
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
    const web3 = await getWeb3()
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
