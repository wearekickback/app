import merge from 'lodash/merge'
import PublicDeployer from '@noblocknoparty/contracts/build/contracts/Deployer.json'
import PrivateDeployer from '../build/contracts/Deployer.json'
import eventsList from '../fixtures/events.json'  
import {toHex, toWei} from 'web3-utils'
import getEthers, { signer, getEvents, getNetwork } from './ethers'
import singleEventResolvers, {
  defaults as singleEventDefaults
} from './resolvers/singleEventResolvers'
import ensResolvers, { defaults as ensDefaults } from './resolvers/ensResolvers'

const deployerAbi = PublicDeployer.abi
const deployerContractAddresses = Object.assign(
  {},
  PrivateDeployer.networks,
  PublicDeployer.networks
)

const rootDefaults = {
  ethers: {
    accounts: [],
    networkId: 0,
    __typename: 'Web3'
  }
}

const resolvers = {
  Query: {
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
      return (await getEvents(deployerContractAddresses, deployerAbi)).map((event)=>{
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
      const networkId = await getNetwork()
      const deployer = deployerContractAddresses[networkId]
      const contract = new ethers.Contract(deployer.address, deployerAbi, signer)

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
