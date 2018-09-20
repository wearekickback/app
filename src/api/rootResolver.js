import merge from 'lodash/merge'
import {toHex, toWei} from 'web3-utils'
import Deployer from '@noblocknoparty/contracts/build/contracts/Deployer.json'

import eventsList from '../fixtures/events.json'
import getEthers, { signer, getEvents, getDeployerAddress } from './ethers'
import singleEventResolvers, {
  defaults as singleEventDefaults
} from './resolvers/singleEventResolvers'
import ensResolvers, { defaults as ensDefaults } from './resolvers/ensResolvers'


const deployerAbi = Deployer.abi

const rootDefaults = {
  ethers: {
    accounts: [],
    networkId: 0,
    __typename: 'Web3'
  }
}

const resolvers = {
  Query: {
    async accounts() {},
    async ethers() {
      return {
        ...getEthers(),
        __typename: 'Ethers'
      }
    },
    async parties() {
      return eventsList.map(event => ({ ...event, __typename: 'PartyMeta' }))
    },
    async events() {
      const deployerAddress = await getDeployerAddress()

      return (await getEvents(deployerAddress, deployerAbi)).map((event)=>{
        console.log('event', event)
        return {
          name: event.args.deployedAddress,
          address: event.args.deployedAddress,
          __typename: event.event
        }
      })
    }
  },

  Mutation: {
    async create(_, { name, deposit, limitOfParticipants}) {
      const ethers = getEthers()

      const deployerAddress = await getDeployerAddress()

      const contract = new ethers.Contract(deployerAddress, deployerAbi, signer)

      try {
        const txId = await contract.deploy(
          name,
          toHex(toWei(deposit)),
          toHex(limitOfParticipants),
          toHex(60 * 60 * 24 * 7),
          ''
        )
        return txId
      } catch (e) {
        console.log('error', e)
      }
    },
    async signMessage(message) {
      const signature = await signer.signMessage(message)
      return signature
    },
    async verifyMessage(message, signature) {
      const ethers = getEthers()
      return ethers.Wallet.verifyMessage(message, signature)
    }
  }
}

const defaults = merge(rootDefaults, singleEventDefaults, ensDefaults)

export default merge(resolvers, singleEventResolvers, ensResolvers)

export { defaults }
