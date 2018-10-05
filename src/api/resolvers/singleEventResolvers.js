import getWeb3, { getAccount } from '../web3'
import { Conference } from '@noblocknoparty/contracts'
import events from '../../fixtures/events.json'
import { GET_MARKED_ATTENDED } from '../../graphql/queries'
import { getItem, setItem } from '../localStorage'

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

    async owner({ contract }) {
      return contract.owner().call()
    },
    async name({ contract }) {
      return contract.name().call()
    },
    async attendees({ contract }) {
      const attendees = await contract.registered().call()
      return parseInt(attendees, 10)
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
            console.log(arr)
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
    },
    markAttendedSingle: async (_, { contractAddress }, { cache }) => {
      const array = getItem('markedAttendedList' + contractAddress) || []

      cache.writeData({
        data: {
          markedAttendedList: array
        }
      })

      return array
    }
  },

  Mutation: {
    async markAttended(_, { address, contractAddress }, { cache }) {
      const { markedAttendedList } = cache.readQuery({
        query: GET_MARKED_ATTENDED
      })

      const data = {
        markedAttendedList: [...markedAttendedList]
      }

      console.log(contractAddress, address)

      const exists = data.markedAttendedList.includes(address.toLowerCase())
      //check for duplicates
      if (!exists) {
        data.markedAttendedList.push(address.toLowerCase())
      } else {
        console.log('Attendee already marked as attended')
        return null
      }

      cache.writeData({ data })
      setItem('markedAttendedList' + contractAddress, data.markedAttendedList)

      return data.markedAttendedList
    },
    async unmarkAttended(_, { address, contractAddress }, { cache }) {
      const { markedAttendedList } = cache.readQuery({
        query: GET_MARKED_ATTENDED
      })

      const lowercaseAddress = address.toLowerCase()

      const data = {
        markedAttendedList: markedAttendedList.filter(
          item => item !== lowercaseAddress
        )
      }

      cache.writeData({ data })
      setItem('markedAttendedList' + contractAddress, data.markedAttendedList)

      return data.markedAttendedList
    },
    async rsvp(_, { twitter, address }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      const deposit = await contract.deposit().send({ from: account })
      try {
        return contract.register(twitter).send({
          from: account,
          value: deposit,
          gas: 1000000
        })
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async setLimitOfParticipants(_, { address, limit }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        return contract.setLimitOfParticipants(limit).send({ from: account })
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async payback(_, { address }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        return contract.payback().send({ from: account })
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
        return contract.clear().send({ from: account })
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async changeName(_, { address, name }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        return contract.changeName(name).send({ from: account })
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async batchAttend(_, { address, attendees }, { cache }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        return contract
          .attend(attendees)
          .send({ from: account })
          .then(() => {
            cache.write({
              data: {
                markedAttendedList: []
              }
            })

            setItem('markedAttendedList' + address, [])
          })
      } catch (e) {
        console.log(e)
        return null
      }
    }
  }
}

export default resolvers
