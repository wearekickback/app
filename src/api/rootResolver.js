import merge from 'lodash/merge'
import { toHex, toWei } from 'web3-utils'
import { Deployer } from '@noblocknoparty/contracts'
import { events } from '@noblocknoparty/contracts'
import { parseLog } from 'ethereum-event-logs'

import eventsList from '../fixtures/events.json'
import getWeb3, {
  getAccount,
  getEvents,
  getTransactionLogs,
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

        const logs = await getTransactionLogs(tx.hash)

        const [event] = parseLog(logs, [events.NewParty])

        return event.args.deployedAddress
      } catch (e) {
        console.log('error', e)

        throw new Error(`Failed to deploy party: ${e}`)
      }
    },
    // async signMessage(message) {
    //   const signature = await signer.signMessage(message)
    //   return signature
    // },
    // async verifyMessage(message, signature) {
    //   const ethers = getEthers()
    //   return ethers.Wallet.verifyMessage(message, signature)
    // }
    async signChallengeString (_, { challengeString }) {
      const web3 = await getWeb3()
      const address = await getAccount()

      console.log(`Ask user ${address} to sign: ${challengeString}`)

      return web3.eth.personal.sign(challengeString, address)
    }
  }
}

const defaults = merge(rootDefaults, singleEventDefaults, ensDefaults)

export default merge(resolvers, singleEventResolvers, ensResolvers)

export { defaults }
