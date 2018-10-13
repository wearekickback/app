import { Deployer } from '@noblocknoparty/contracts'
import Web3 from 'web3'
import EventEmitter from 'eventemitter3'

import { DEPLOYER_CONTRACT_ADDRESS, NETWORK } from '../config'
import { getProvider } from '../GlobalState'
import { NEW_BLOCK } from '../utils/events'

let web3
let networkState = {}

export const events = new EventEmitter()

const updateGlobalState = () => {
  getProvider().then(provider => {
    provider.setNetworkState({ ...networkState })
  })
}

async function getWeb3() {
  if (!web3) {
    networkState = {}

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (window.web3 && window.web3.currentProvider) {
      web3 = new Web3(window.web3.currentProvider)
      networkState.readOnly = false
    } else {
      console.log('No web3 instance injected. Falling back to Infura')
      web3 = new Web3(`https://${NETWORK}.infura.io/`)
      networkState.readOnly = true
    }

    try {
      networkState.networkId = `${await web3.eth.net.getId()}`
    } catch (e) {
      web3 = null
    }

    if (networkState.networkId) {
      switch (NETWORK) {
        case 'ropsten': {
          if (networkState.networkId !== '3') {
            networkState.shouldBeOnNetwork = 'Ropsten'
          }
          break
        }
        case 'mainnet': {
          if (networkState.networkId !== '1') {
            networkState.shouldBeOnNetwork = 'Mainnet'
          }
          break
        }
        default:
          break
      }

      if (networkState.shouldBeOnNetwork) {
        web3 = null
      }
    }

    // update global state with current network state
    updateGlobalState()

    // if web3 not set then something failed
    if (!web3) {
      throw new Error('Error getting web3 setup')
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
  }

  return web3
}

export async function getDeployerAddress() {
  // if local env doesn't specify address then assume we're on a public net
  return DEPLOYER_CONTRACT_ADDRESS || Deployer.networks[networkState.networkId].address
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
  try {
    const web3 = await getWeb3()
    const accounts = await web3.eth.getAccounts()
    return accounts[0]
  } catch (_) {
    return null
  }
}

export default getWeb3
