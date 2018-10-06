import { Deployer } from '@noblocknoparty/contracts'
import Web3 from 'web3'
import EventEmitter from 'eventemitter3'

import { DEPLOYER_CONTRACT_ADDRESS, NETWORK } from '../config'
import { NEW_BLOCK } from '../utils/events'

let web3
let networkError

export const events = new EventEmitter()

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
        web3 = new Web3(`https://mainnet.infura.io/`)
        console.log('No network specified in config, Falling back to mainnet.')
      }
    }

    try {
      await web3.eth.net.getId()
    } catch (e) {
      web3 = null
      networkError = `We were unable to connect to the Ethereum network`
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

export function getNetworkError() {
  return networkError
}

export async function getDeployerAddress() {
  // if local env doesn't specify address then assume we're on a public net
  const id = await web3.eth.net.getId()
  return DEPLOYER_CONTRACT_ADDRESS || Deployer.NETWORKS[id].address
}

export async function getTransactionReceipt(txHash) {
  const web3 = await getWeb3()
  return web3.eth.getTransactionReceipt(txHash)
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
  const web3 = await getWeb3()
  const accounts = await web3.eth.getAccounts()
  return accounts[0]
}

export default getWeb3
