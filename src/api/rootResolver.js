import merge from 'lodash/merge'
import getEthers, { provider, signer } from './ethers'
import Conference from '@noblocknoparty/contracts/build/contracts/Conference.json'
import eventsList from '../fixtures/events.json'

const abi = Conference.abi

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
      return attendees.toNumber()
    },
    async deposit({ contract }) {
      const deposit = await contract.deposit()
      const { utils } = getEthers()
      return utils.formatEther(deposit.toString())
    },
    async limitOfParticipants({ contract }) {
      const limitOfParticipants = await contract.limitOfParticipants()
      return limitOfParticipants.toNumber()
    },
    async registered({ contract }) {
      const registered = await contract.registered()
      return registered.toNumber()
    },
    async attended({ contract }) {
      const attended = await contract.attended()
      return attended.toNumber()
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
      try {
        const encryption = await contract.encryption()
        return encryption
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async rsvp({ contract }, {}) {
      try {
        const encryption = await contract.rsvp('_jefflau')
        return encryption
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async participants({ contract }) {
      const registeredRaw = await contract.registered()
      const registered = registeredRaw.toNumber()
      const participantsRaw = Array.from({ length: registered }).map((_, i) =>
        contract
          .participantsIndex(i + 1)
          .then(address => contract.participants(address))
      )

      const participants = await Promise.all(participantsRaw).then(
        participantsRaw =>
          participantsRaw.map(arr => ({
            participantName: arr[0],
            address: arr[1],
            attended: arr[2],
            paid: arr[3],
            __typename: 'Participant'
          }))
      )
      return participants
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
      const ethers = getEthers()
      const contract = new ethers.Contract(address, abi, signer || provider)
      return {
        address,
        contract,
        __typename: 'Party'
      }
    },
    async parties() {
      return eventsList.map(event => ({ ...event, __typename: 'PartyMeta' }))
    }
  },

  Mutation: {
    async rsvp(_, { twitter, address }) {
      const ethers = getEthers()
      const contract = new ethers.Contract(address, abi, signer)
      const deposit = await contract.deposit()
      try {
        const txId = await contract.register(twitter, {
          nonce: 0,
          value: deposit
        })
        return txId
      } catch (e) {
        console.log(e)
      }
    },
    async setLimitOfParticipants(_, { address, limit }) {
      console.log('in limit', address)
      const ethers = getEthers()
      //console.log(address)
      console.log('SET LIMT', address, signer)
      const contract = new ethers.Contract(address, abi, signer)

      console.log(contract)
      try {
        console.log('here1')
        contract
          .setLimitOfParticipants(1000)
          .then(console.log)
          .catch(e => console.log('error here', e))
        console.log('here3')
        return
      } catch (e) {
        console.log('here2')
        console.log(e)
      }
    }
  }
}

const defaults = merge(rootDefaults)

export default merge(resolvers)

export { defaults }
