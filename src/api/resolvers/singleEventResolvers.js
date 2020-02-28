import { toBN, fromWei } from 'web3-utils'
import { Deployer } from '@wearekickback/contracts'
import { Conference } from '@wearekickback/contracts'

import getWeb3, { getAccount, getDeployerAddress, getWeb3Read } from '../web3'
import events from '../../fixtures/events.json'
import { txHelper, EMPTY_ADDRESS } from '../utils'
import { toEthVal } from '../../utils/units'

const deployerAbi = Deployer.abi
const abi = Conference.abi

export const defaults = {
  markedAttendedList: []
}

async function getPartyContract(address) {
  const web3 = await getWeb3Read()
  const { methods } = new web3.eth.Contract(abi, address)
  return methods
}

const resolvers = {
  PartyFromContract: {
    description: party => party.description_text || null,
    date: party => party.date || null,
    location: party => party.location_text || null,

    async balance({ address }) {
      const web3 = await getWeb3Read()
      return web3.eth.getBalance(address)
    },

    async owner({ address }) {
      const contract = await getPartyContract(address)
      try {
        const owner = await contract.owner().call()
        console.log('owner', owner)
      } catch (e) {
        console.log('error calling owner', e)
      }
      return contract.owner().call()
    },
    async admins({ address }) {
      const contract = await getPartyContract(address)
      return contract.getAdmins().call()
    },
    async name({ address }) {
      const contract = await getPartyContract(address)
      return contract.name().call()
    },
    async deposit({ address }) {
      const contract = await getPartyContract(address)
      const deposit = await contract.deposit().call()
      return fromWei(deposit.toString())
    },
    async participantsLimit({ address }) {
      const contract = await getPartyContract(address)
      const limitOfParticipants = await contract.limitOfParticipants().call()
      return parseInt(limitOfParticipants, 10)
    },
    async registered({ address }) {
      const contract = await getPartyContract(address)
      const registered = await contract.registered().call()
      return parseInt(registered, 10)
    },
    async ended({ address }) {
      const contract = await getPartyContract(address)
      const ended = await contract.ended().call()
      return ended
    },
    async cancelled({ address }) {
      const contract = await getPartyContract(address)
      const cancelled = await contract.cancelled().call()
      return cancelled
    },
    async endedAt({ address }) {
      const contract = await getPartyContract(address)
      const endedAt = await contract.endedAt().call()
      return endedAt
    },
    async coolingPeriod({ address }) {
      const contract = await getPartyContract(address)
      const coolingPeriod = await contract.coolingPeriod().call()
      return coolingPeriod
    },
    async tokenAddress({ address }) {
      const contract = await getPartyContract(address)
      const tokenAddress = await contract.tokenAddress().call()
      return tokenAddress
    },
    async payoutAmount({ address }) {
      const contract = await getPartyContract(address)
      const payoutAmount = await contract.payoutAmount().call()
      return fromWei(payoutAmount.toString())
    },
    async participants({ address }) {
      const contract = await getPartyContract(address)
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
    async partyFromContract(_, { address }) {
      const web3 = await getWeb3Read()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      const eventFixture = events.filter(event => {
        return event.address === address
      })[0]
      return {
        address,
        contract: contract.methods,
        ...eventFixture,
        __rawContract: contract,
        __typename: 'PartyFromContract'
      }
    }
  },

  Mutation: {
    async createParty(_, args) {
      console.log(`Deploying party`, args)

      const { id, deposit, decimals, limitOfParticipants, coolingPeriod } = args
      let tokenAddress = args.tokenAddress

      const web3 = await getWeb3()
      const account = await getAccount()

      if (tokenAddress === '') {
        tokenAddress = EMPTY_ADDRESS
      }

      const deployerAddress = await getDeployerAddress()

      const contract = new web3.eth.Contract(deployerAbi, deployerAddress)

      try {
        const tx = await new Promise((resolve, reject) =>
          contract.methods
            .deploy(
              id,
              toEthVal(deposit, 'eth')
                .scaleDown(decimals)
                .toString(16),
              toEthVal(limitOfParticipants).toString(16),
              toEthVal(coolingPeriod).toString(16),
              tokenAddress
            )
            .send({
              gas: 3000000,
              from: account
            })
            .on('transactionHash', hash => {
              resolve(hash)
            })
        )

        console.log('tx', tx)

        return tx
      } catch (e) {
        console.log('error', e)

        throw new Error(`Failed to deploy party: ${e}`)
      }
    },
    async addAdmins(_, { address, userAddresses }) {
      console.log(`Adding admins:\n${userAddresses.join('\n')}`)

      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        const tx = await txHelper(
          contract.grant(userAddresses).send({
            from: account
          })
        )

        return tx
      } catch (err) {
        console.error(err)

        throw new Error(`Failed to add admin`)
      }
    },
    async rsvp(_, { address }) {
      let tokenAddress
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        tokenAddress = await contract.tokenAddress().call()
      } catch (err) {
        console.error(`Failed to get tokenAddress`, err)
      }
      let deposit
      if (tokenAddress && tokenAddress !== EMPTY_ADDRESS) {
        deposit = 0
      } else {
        deposit = await contract.deposit().call()
      }
      try {
        const tx = await txHelper(
          contract.register().send({
            from: account,
            value: deposit
          })
        )
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
        const tx = await txHelper(
          contract.finalize(maps.map(m => toBN(m).toString(10))).send({
            from: account
          })
        )

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
        const tx = await txHelper(
          contract.withdraw().send({
            from: account
          })
        )

        return tx
      } catch (err) {
        console.error(err)

        throw new Error(`Failed to withdraw`)
      }
    },
    async setLimitOfParticipants(_, { address, limit }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      try {
        const tx = await txHelper(
          contract.setLimitOfParticipants(limit).send({ from: account })
        )

        return tx
      } catch (e) {
        console.log(e)
        return null
      }
    },
    async changeDeposit(_, { address, deposit }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      const depositInWei = toEthVal(deposit, 'eth')
        .toWei()
        .toString(16)
      try {
        const tx = await txHelper(
          contract.changeDeposit(depositInWei).send({ from: account })
        )

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
        const tx = await txHelper(contract.clear().send({ from: account }))

        return tx
      } catch (e) {
        console.log(e)
        return null
      }
    }
  }
}

export default resolvers
