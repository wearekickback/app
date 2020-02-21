import merge from 'lodash/merge'
import { Deployer } from '@wearekickback/contracts'

import eventsList from '../fixtures/events.json'
import getWeb3, {
  getAccount,
  getEvents,
  getDeployerAddress,
  isLocalEndpoint
} from './web3'
import singleEventResolvers, {
  defaults as singleEventDefaults
} from './resolvers/singleEventResolvers'
import ensResolvers, { defaults as ensDefaults } from './resolvers/ensResolvers'
import tokenResolvers, {
  defaults as tokenDefaults
} from './resolvers/tokenResolvers'

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
    async events() {
      const deployerAddress = await getDeployerAddress()
      const events = await getEvents(deployerAddress, deployerAbi)

      return events.map(event => ({
        name: event.args.deployedAddress,
        address: event.args.deployedAddress,
        __typename: event.event
      }))
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
