import { toBN, fromWei } from 'web3-utils'
import { Deployer } from '@wearekickback/contracts'
import { Conference } from '@wearekickback/contracts'
import multihash from 'multihashes'

import getWeb3, { getAccount, getDeployerAddress, getWeb3Read } from '../web3'
import events from '../../fixtures/events.json'
import { txHelper, EMPTY_ADDRESS } from '../utils'
import { toEthVal } from '../../utils/units'
import IpfsHttpClient from 'ipfs-http-client'

const ipfs = IpfsHttpClient({
  protocol: 'https',
  // host: 'api.thegraph.com',
  host: 'cloudflare-ipfs.com',
  port: '5001',
  'api-path': '/ipfs/api/v0'
})

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
      const web3 = await getWeb3Read()
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
      return fromWei(deposit.toString())
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
      return fromWei(payoutAmount.toString())
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
      const web3 = await getWeb3Read()
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

      const { id, deposit, decimals, limitOfParticipants, coolingPeriod } = args
      let tokenAddress = args.tokenAddress

      const web3 = await getWeb3()
      const account = await getAccount()

      if (tokenAddress === '') {
        tokenAddress = EMPTY_ADDRESS
      }

      const deployerAddress = await getDeployerAddress()

      const contract = new web3.eth.Contract(deployerAbi, deployerAddress)
      console.log(
        'on chain info',
        id,
        deposit,
        coolingPeriod,
        limitOfParticipants,
        tokenAddress,
        toEthVal(deposit, 'eth')
          .scaleDown(decimals)
          .toString(16),
        toEthVal(limitOfParticipants).toString(16),
        toEthVal(coolingPeriod).toString(16),
        tokenAddress
      )

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
    async changeMeta(_, { address, meta }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, address)
      // const depositInWei = toEthVal(deposit, 'eth')
      //   .toWei()
      //   .toString(16)
      // "QmfR8hBapMEruidnTKfV6E5d8TxP7KWBR83NdcEfnNSRYM";
      // "0x516d665238684261704d45727569646e544b66563645356438547850374b57425238334e646345666e4e5352594d";
      let contentHash = 'QmfR8hBapMEruidnTKfV6E5d8TxP7KWBR83NdcEfnNSRYM'
      let ipfsHash = web3.utils.sha3(contentHash)
      console.log({ address, contentHash, ipfsHash })
      contract.changeMeta(ipfsHash).send({ from: account })
      try {
        const tx = await txHelper(
          contract.changeMeta(ipfsHash).send({ from: account })
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
    },
    async updatePartyMeta(_, { address, meta }) {
      console.log(JSON.stringify(meta))
      let returnedValue = await ipfs.pin.add(JSON.stringify(meta))
      // for await (returnedValue of ipfs.add(JSON.stringify(meta), { 'stream-channels': false })) {
      //   console.log(2, {returnedValue})
      // }
      console.log(returnedValue)
      return returnedValue
    }
  }
}

export default resolvers
