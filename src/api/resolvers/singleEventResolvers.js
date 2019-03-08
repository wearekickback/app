import { toBN } from 'web3-utils'
import getWeb3, { getAccount } from '../web3'
import { Conference } from '@wearekickback/contracts'
import events from '../../fixtures/events.json'

const abi = Conference.abi

// TODO: check if local storage has been called for this contract
// let hydrated = {}

export const defaults = {
  markedAttendedList: []
}

const resolvers = {
  Party: {
    description: party => party.description_text || null,
    date: party => party.date || null,
    location: party => party.location_text || null,

    async balance({ address }) {
      const web3 = await getWeb3()
      return web3.eth.getBalance(address)
    },

    async owner({ contract }) {
      return contract.owner().call()
    },
    async admins({ contract }) {
      return contract.getAdmins().call()
    },
    async name({ contract }) {
      return contract.name().call()
    },
    async deposit({ contract }) {
      const deposit = await contract.deposit().call()
      const { utils } = await getWeb3()
      return utils.fromWei(deposit.toString())
    },
    async limitOfParticipants({ contract }) {
      const limitOfParticipants = await contract.limitOfParticipants().call()
      return parseInt(limitOfParticipants, 10)
    },
    async registered({ contract }) {
      const registered = await contract.registered().call()
      return parseInt(registered, 10)
    },
    async attended({ contract }) {
      const attended = await contract.attended().call()
      return parseInt(attended, 10)
    },
    async ended({ contract }) {
      const ended = await contract.ended().call()
      return ended
    },
    async cancelled({ contract }) {
      const cancelled = await contract.cancelled().call()
      return cancelled
    },
    async endedAt({ contract }) {
      const endedAt = await contract.endedAt().call()
      return endedAt
    },
    async coolingPeriod({ contract }) {
      const coolingPeriod = await contract.coolingPeriod().call()
      return coolingPeriod
    },
    async payoutAmount({ contract }) {
      const payoutAmount = await contract.payoutAmount().call()
      const { utils } = await getWeb3()
      return utils.fromWei(payoutAmount.toString())
    },
    async encryption({ contract }) {
      try {
        const encryption = await contract.encryption().call()
        return encryption
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async participants({ contract }) {
      const registeredRaw = await contract.registered().call()
      const registered = parseInt(registeredRaw)
      const participantsRaw = Array.from({ length: registered }).map((_, i) =>
        contract
          .participantsIndex(i + 1)
          .call()
          .then(address => contract.participants(address).call())
      )

      const participants = await Promise.all(participantsRaw).then(
        participantsRaw =>
          participantsRaw.map(arr => {
            return {
              participantName: arr.participantName,
              address: arr.addr,
              attended: arr.attended,
              paid: arr.paid,
              __typename: 'Participant'
            }
          })
      )
      return participants
    }
  },
  Query: {
    async party(_, { address }) {
      const web3 = await getWeb3()
      const contract = new web3.eth.Contract(abi, address)
      const eventFixture = events.filter(event => {
        return event.address === address
      })[0]
      return {
        address,
        contract: contract.methods,
        ...eventFixture,
        __rawContract: contract,
        __typename: 'Party'
      }
    }
  },

  Mutation: {
    async addAdmins(_, { address, userAddresses }) {
      console.log(`Adding admins:\n${userAddresses.join('\n')}`)

      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        const tx = await contract.grant(userAddresses).send({
          from: account
        })

        return tx
      } catch (err) {
        console.error(err)

        throw new Error(`Failed to add admin`)
      }
    },
    async rsvp(_, { address }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      const deposit = await contract.deposit().call()
      try {
        const tx = await contract.register().send({
          from: account,
          value: deposit
        })
        return tx
      } catch (err) {
        console.error(err)

        throw new Error(`Failed to RSVP`)
      }
    },
    async finalize(_, { address, maps }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        const tx = await contract
          .finalize(maps.map(m => toBN(m).toString(10)))
          .send({
            from: account
          })

        return tx
      } catch (err) {
        console.error(err)

        throw new Error(`Failed to finalize`)
      }
    },
    async withdrawPayout(_, { address }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        const tx = await contract.withdraw().send({
          from: account
        })

        return tx
      } catch (err) {
        console.error(err)

        throw new Error(`Failed to withdraw`)
      }
    },
    async setLimitOfParticipants(_, { address, limit }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      console.log(address)
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        const tx = await contract
          .setLimitOfParticipants(limit)
          .send({ from: account })

        return tx
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async clear(_, { address }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        const tx = await contract.clear().send({ from: account })

        return tx
      } catch (e) {
        console.log(e)
        return null
      }
    }
  }
}

export default resolvers
