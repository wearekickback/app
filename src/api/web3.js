import { Deployer } from '@noblocknoparty/contracts'
import Web3 from 'web3'
import EventEmitter from 'eventemitter3'

import { DEPLOYER_CONTRACT_ADDRESS, NETWORK } from '../config'
import { getProvider } from '../GlobalState'
import { NEW_BLOCK } from '../utils/events'

let web3
let networkId
let networkError

export const events = new EventEmitter()

const updateGlobalState = () => {
  getProvider().then(provider => {
    provider.setNetworkState({
      networkId,
      networkError,
    })
  })
}


function setNetworkId (id) {
  networkId = id
  updateGlobalState()
}

function setNetworkError(msg) {
  networkError = msg
  updateGlobalState()
}

async function getWeb3() {
  if (!web3) {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (window.web3 && window.web3.currentProvider) {
      web3 = new Web3(window.web3.currentProvider)
    } else {
      console.log('No web3 instance injected. Falling back to Infura')
      if (NETWORK) {
        web3 = new Web3(`https://${NETWORK}.infura.io/`)
      } else {
        console.log('No network specified in config, Falling back to mainnet.')
        web3 = new Web3(`https://mainnet.infura.io/`)
      }
    }

    try {
      setNetworkId(`${await web3.eth.net.getId()}`)
    } catch (e) {
      setNetworkError(`You are not connected to the Ethereum network`)
      web3 = null
      throw e
    }

    try {
      switch (NETWORK) {
        case 'ropsten': {
          if (networkId !== '3') {
            throw new Error('You are viewing events on Ropsten, but you are connected to a different network!')
          }
          break
        }
        case 'mainnet': {
          if (networkId !== '1') {
            throw new Error('You are viewing events on Mainnet, but you are connected to a different network!')
          }
          break
        }
        default:
          break
      }
    } catch (e) {
      setNetworkError(e.message)
      web3 = null
      throw e
    }

    if (web3) {
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
  }

  return web3
}

export async function getDeployerAddress() {
  // if local env doesn't specify address then assume we're on a public net
  return DEPLOYER_CONTRACT_ADDRESS || Deployer.networks[networkId].address
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
