import { toBN } from 'web3-utils'
import { Deployer } from '@wearekickback/contracts'
import { Conference } from '@wearekickback/contracts'

import getWeb3, { getAccount, getDeployerAddress } from '../web3'
import events from '../../fixtures/events.json'
import { txHelper, EMPTY_ADDRESS } from '../utils'
import { toEthVal } from '../../utils/units'
import {
  isUsingUniversalLogin,
  universalLoginSdk,
  getDeposit,
  registerToEvent,
  getApplicationWallet,
  getTokenAddress
} from '../../universal-login'

const deployerAbi = Deployer.abi
const abi = Conference.abi

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
    async createParty(_, args) {
      console.log(`Deploying party`, args)

      const { id, deposit, limitOfParticipants, coolingPeriod } = args
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
                .toWei()
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
      try {
        if (isUsingUniversalLogin()) {
          const deposit = await getDeposit(address, universalLoginSdk.provider)
          return await registerToEvent(
            await getApplicationWallet(),
            address,
            deposit,
            universalLoginSdk
          )
        } else {
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
          const tx = await txHelper(
            contract.register().send({
              from: account,
              value: deposit
            })
          )
          return tx
        }
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
