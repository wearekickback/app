import _ from 'lodash'
import merge from 'lodash/merge'
import { toHex, toWei } from 'web3-utils'
import { Deployer } from '@noblocknoparty/contracts'

import eventsList from '../fixtures/events.json'
import { subscriptionResolver } from '../graphql/utils'
import { NEW_BLOCK } from '../constants/events'
import { NUM_CONFIRMATIONS } from '../constants/ethereum'
import getWeb3, {
  getAccount,
  getEvents,
  getTransactionReceipt,
  getDeployerAddress
} from './web3'
import singleEventResolvers, {
  defaults as singleEventDefaults
} from './resolvers/singleEventResolvers'
import ensResolvers, { defaults as ensDefaults } from './resolvers/ensResolvers'

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
      return {
        ...getWeb3(),
        __typename: 'Web3'
      }
    },
    async parties() {
      return eventsList.map(event => ({ ...event, __typename: 'PartyMeta' }))
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
    async create(_, { name, deposit, limitOfParticipants }) {
      const web3 = await getWeb3()
      const account = await getAccount()

      const deployerAddress = await getDeployerAddress()

      const contract = new web3.eth.Contract(deployerAbi, deployerAddress)

      try {
        const tx = await contract.methods
          .deploy(
            name,
            toHex(toWei(deposit)),
            toHex(limitOfParticipants),
            toHex(60 * 60 * 24 * 7),
            ''
          )
          .send({
            gas: 4000000,
            from: account
          })

        return tx
      } catch (e) {
        console.log('error', e)

        throw new Error(`Failed to deploy party: ${e}`)
      }
    },
    async signChallengeString (_, { challengeString }) {
      const web3 = await getWeb3()
      const address = await getAccount()

      console.log(`Ask user ${address} to sign: ${challengeString}`)

      return web3.eth.personal.sign(challengeString, address)
    },
  },

  Subscription: {
    transactionStatus: subscriptionResolver(NEW_BLOCK, async ({ number }, { txHash }) => {
      // check if transaction succeeded
      const tx = await getTransactionReceipt(txHash)
      if (!_.get(tx, 'status')) {
        throw new Error('Transaction failed!')
      }

      // confirmations
      const confirmations = number - tx.blockNumber
      const progress = parseInt((confirmations / NUM_CONFIRMATIONS) * 100.0)
      const confirmed = (confirmations === NUM_CONFIRMATIONS)

      return {
        confirmed,
        confirmations,
        progress,
      }
    })
  }
}

const defaults = merge(rootDefaults, singleEventDefaults, ensDefaults)

export default merge(resolvers, singleEventResolvers, ensResolvers)

export { defaults }
