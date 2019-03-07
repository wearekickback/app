import merge from 'lodash/merge'
import { Deployer } from '@wearekickback/contracts'

import eventsList from '../fixtures/events.json'
import getWeb3, {
  getAccount,
  getEvents,
  getDeployerAddress,
  isLocalEndpoint
} from './web3'
import { toEthVal } from '../utils/units'
import singleEventResolvers, {
  defaults as singleEventDefaults
} from './resolvers/singleEventResolvers'
import ensResolvers, { defaults as ensDefaults } from './resolvers/ensResolvers'
import qrCodeResolvers, {
  defaults as qrCodeDefaults
} from './resolvers/qrCodeResolvers'

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
    async createParty(_, args) {
      console.log(`Deploying party`, args)

      const { id, deposit, limitOfParticipants, coolingPeriod } = args

      const web3 = await getWeb3()
      const account = await getAccount()

      const deployerAddress = await getDeployerAddress()

      const contract = new web3.eth.Contract(deployerAbi, deployerAddress)

      try {
        const tx = await contract.methods
          .deploy(
            id,
            toEthVal(deposit, 'eth')
              .toWei()
              .toString(16),
            toEthVal(limitOfParticipants).toString(16),
            toEthVal(coolingPeriod).toString(16)
          )
          .send({
            gas: 3000000,
            from: account
          })

        return tx
      } catch (e) {
        console.log('error', e)

        throw new Error(`Failed to deploy party: ${e}`)
      }
    },
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
  qrCodeDefaults
)
export default merge(
  resolvers,
  singleEventResolvers,
  ensResolvers,
  qrCodeResolvers
)
export { defaults }
