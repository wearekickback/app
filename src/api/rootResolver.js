import merge from 'lodash/merge'
import { Deployer } from '@wearekickback/contracts'

import eventsList from '../fixtures/events.json'
import getWeb3, {
  getAccount,
  getEvents,
  getDeployerAddress,
  isLocalEndpoint,
  getWeb3ForNetwork
} from './web3'
import singleEventResolvers, {
  defaults as singleEventDefaults
} from './resolvers/singleEventResolvers'
import ensResolvers, { defaults as ensDefaults } from './resolvers/ensResolvers'
import tokenResolvers, {
  defaults as tokenDefaults
} from './resolvers/tokenResolvers'
import { getFragmentDefinitions } from 'apollo-utilities'

let reverseAddress = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C'
let reverseAbi = [
  {
    inputs: [{ internalType: 'contract ENS', name: '_ens', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'addresses', type: 'address[]' }
    ],
    name: 'getNames',
    outputs: [{ internalType: 'string[]', name: 'r', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function'
  }
]

const deployerAbi = Deployer.abi

const rootDefaults = {
  web3: {
    accounts: [],
    networkId: 0,
    __typename: 'Web3'
  }
}

const resolvers = {
  Query: {
    async accounts() {},
    async web3() {
      const web3 = await getWeb3()
      console.log('web3', web3)
      return {
        ...web3,
        __typename: 'Web3'
      }
    },
    async parties() {
      return eventsList.map(event => ({
        ...event,
        __typename: 'PartyMeta'
      }))
    },
    async getDeployer() {
      return await getDeployerAddress()
    },
    async events() {
      const deployerAddress = await getDeployerAddress()
      const events = await getEvents(deployerAddress, deployerAbi)

      return events.map(event => ({
        name: event.args.deployedAddress,
        address: event.args.deployedAddress,
        __typename: event.event
      }))
    },
    async poapBadges(_, { userAddress }) {
      let response = await fetch(
        `https://api.poap.xyz/actions/scan/${userAddress}`
      )
      return response.json()
    },
    async getEnsName(_, { userAddress }) {
      const web3 = await getWeb3ForNetwork('1')
      const contract = new web3.eth.Contract(reverseAbi, reverseAddress).methods

      const name = await contract.getNames([userAddress]).call()
      return {
        name
      }
    },
    async getEnsAddress(_, { name }) {
      const web3 = await getWeb3ForNetwork('1')
      const address = await web3.eth.ens.getAddress(name)

      return {
        address
      }
    },
    async getNFTs(_, { userAddress }) {
      let pageNumber = 0
      // let url = `https://api.covalenthq.com/v1/1/address/${userAddress}/balances_v2/?key=${process.env.C_KEY}&nft=true&page-number=${pageNumber}&page-size=100`
      let url = `https://api.covalenthq.com/v1/1/address/${userAddress}/balances_v2/?key=ckey_125f8d62ef8b4410a92c2787d6c&nft=true&page-number=${pageNumber}&page-size=100`
      let data = await fetch(url)
      let {
        data: { items: items }
      } = await data.json()
      return items.filter(i => {
        return !!i.nft_data
      })
    }
  },

  Mutation: {
    async signChallengeString(_, { challengeString }) {
      const web3 = await getWeb3()
      const address = await getAccount()
      const unlocked = isLocalEndpoint()
      console.log(`Ask user ${address} to sign: ${challengeString}`)

      return !unlocked
        ? web3.eth.personal.sign(challengeString, address, '')
        : web3.eth.sign(challengeString, address)
    }
  }
}

const defaults = merge(
  rootDefaults,
  singleEventDefaults,
  ensDefaults,
  tokenDefaults
)
export default merge(
  resolvers,
  singleEventResolvers,
  ensResolvers,
  tokenResolvers
)
export { defaults }
