import merge from 'lodash/merge'
import getEthers, { provider } from './ethers'
import { abi } from './abi.json'

const rootDefaults = {
  ethers: {
    accounts: [],
    networkId: 0,
    __typename: 'Web3'
  }
}

const resolvers = {
  Party: {
    async name({ contract }) {
      return contract.name()
    },
    async attendees({ contract }) {
      const attendees = await contract.registered()
      return attendees.toString()
    },
    async deposit({ contract }) {
      const deposit = await contract.deposit()
      const { utils } = getEthers()
      return utils.formatEther(deposit.toString())
    },
    async limitOfParticipants({ contract }) {
      const limitOfParticipants = await contract.limitOfParticipants()
      return limitOfParticipants.toString()
    },
    async registered({ contract }) {
      const registered = await contract.registered()
      return parseInt(registered.toString())
    },
    async attended({ contract }) {
      const attended = await contract.attended()
      return parseInt(attended.toString())
    },
    async ended({ contract }) {
      const ended = await contract.ended()
      return ended
    },
    async cancelled({ contract }) {
      const cancelled = await contract.cancelled()
      return cancelled
    },
    async endedAt({ contract }) {
      const endedAt = await contract.endedAt()
      return endedAt
    },
    async coolingPeriod({ contract }) {
      const coolingPeriod = await contract.coolingPeriod()
      return coolingPeriod
    },
    async payoutAmount({ contract }) {
      const payoutAmount = await contract.payoutAmount()
      const { utils } = getEthers()
      return utils.formatEther(payoutAmount.toString())
    },
    async encryption({ contract }) {
      const encryption = await contract.encryption()
      return encryption
    }
  },
  Query: {
    async ethers() {
      return {
        ...getEthers(),
        __typename: 'Ethers'
      }
    },
    async party(_, { address }) {
      const Ethers = getEthers()
      const contract = new Ethers.Contract(address, abi, provider)
      return {
        address,
        contract,
        __typename: 'Party'
      }
    }
  },

  Mutation: {}
}

const defaults = merge(rootDefaults)

export default merge(resolvers)

export { defaults }
