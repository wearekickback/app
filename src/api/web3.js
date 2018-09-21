import { Deployer } from '@noblocknoparty/contracts'
import Web3 from 'web3'

import { DEPLOYER_CONTRACT_ADDRESS, NETWORK } from '../config'

let web3
export let networkError

function getWeb3() {
  if (!web3) {
    return setupWeb3()
  } else {
    return web3
  }
}

export async function getDeployerAddress() {
  // if local env doesn't specify address then assume we're on a public net
  const id = await web3.eth.net.getId()
  return DEPLOYER_CONTRACT_ADDRESS || Deployer.NETWORKS[id].address
}

export async function getTransactionLogs(txHash) {
  const web3 = getWeb3()

  const logs = await web3.eth.getTransactionReceipt(txHash)

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

export async function getAccount() {
  const web3 = getWeb3()
  const accounts = await web3.eth.getAccounts()
  return accounts[0]
}

export async function setupWeb3() {
  //Localnode
  let url = 'http://localhost:8545'

  fetch(url)
    .then(() => {
      console.log('local node active')
      web3 = new Web3(url)
    })
    .catch(error => {
      if (
        error.readyState === 4 &&
        (error.status === 400 || error.status === 200)
      ) {
        // the endpoint is active
        console.log('Success')
      }
    })

  if (web3) {
    return web3
  }

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (window.web3 && window.web3.currentProvider) {
    web3 = new Web3(window.web3.currentProvider)
    console.log(web3)
    return web3
  } else {
    console.log('No web3 instance injected.')
  }
}

export default getWeb3
