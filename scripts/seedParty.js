const jwt = require('jsonwebtoken')
const Web3 = require('web3')
const gqlr = require('graphql-request')
const { GraphQLClient } = gqlr
const EthVal = require('ethval')
const {
  Deployer: { abi: DeployerABI },
  Conference: { abi: ConferenceABI }
} = require('@wearekickback/contracts')
const { DEPLOYER_CONTRACT_ADDRESS } = require('../src/config')
const { parseLog } = require('ethereum-event-logs')
const { events } = require('@wearekickback/contracts')

const PendingParty = `
  mutation createPendingParty($meta: PartyMetaInput!, $password: String) {
    id: createPendingParty(meta: $meta, password: $password)
  }
`

const LoginChallenge = `
  mutation createLoginChallenge($address: String!) {
    createLoginChallenge(address: $address) {
      str
    }
  }
`

const LoginUserNoAuth = `
  mutation loginUser {
    profile: loginUser {
      address
      realName
      username
      lastLogin
      created
      social {
        type
        value
      }
      email {
        verified
        pending
      }
      legal {
        type
        accepted
      }
    }
  }
`

const extractNewPartyAddressFromTx = tx => {
  // coerce events into logs if available
  if (tx.events) {
    tx.logs = Object.values(tx.events).map(a => {
      a.topics = a.raw.topics
      a.data = a.raw.data
      return a
    })
  }
  const [event] = parseLog(tx.logs || [], [events.NewParty])
  return event ? event.args.deployedAddress : null
}

class DummyParty {
  constructor(
    web3,
    owner,
    {
      name = 'Awesome Party',
      description = 'description',
      date = '25th December',
      location = 'Some location',
      image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUk7ni2PYcBZ_qXOLriROqyiiZRGiCMfKnkdx_I1gTOVf3FPGQ'
    },
    endpoint = 'http://localhost:3001/graphql'
  ) {
    this.endpoint = endpoint
    this.web3 = web3
    this.client = new GraphQLClient(endpoint, { headers: {} })
    this.owner = owner
    this.meta = {
      name,
      description,
      date,
      location,
      image
    }
  }

  async deploy() {
    await this.deployNewParty()
  }

  async createPendingParty() {
    const { id } = await this.client.request(PendingParty, {
      meta: this.meta,
      password: ''
    })

    return id
  }

  async getToken(account) {
    const requestChallenge = address => {
      return this.client.request(LoginChallenge, { address })
    }
    const { createLoginChallenge } = await requestChallenge(account)

    const signature = await this.web3.eth.sign(
      createLoginChallenge.str,
      account
    )

    const TOKEN_SECRET = 'kickback'
    const TOKEN_ALGORITHM = 'HS256'

    const token = jwt.sign({ address: account, sig: signature }, TOKEN_SECRET, {
      algorithm: TOKEN_ALGORITHM
    })

    return token
  }

  async deployNewParty() {
    const token = await this.getToken(this.owner)
    this.client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    //await this.client.request(LoginUserNoAuth)

    const id = await this.createPendingParty()

    const deployer = new this.web3.eth.Contract(
      DeployerABI,
      DEPLOYER_CONTRACT_ADDRESS
    )

    const args = [
      id,
      new EthVal(0.02, 'eth').toWei().toString(16),
      new EthVal(100).toString(16),
      new EthVal(1).toString(16)
    ]

    const tx = await deployer.methods.deploy(...args).send({
      gas: 4000000,
      from: this.owner
    })
    const newPartyAddress = extractNewPartyAddressFromTx(tx)

    console.log(`Deployed new party at address: ${newPartyAddress}`)
    this.party = new this.web3.eth.Contract(ConferenceABI, newPartyAddress)

    return this.party
  }

  async rsvp(account) {
    const deposit = await this.party.methods.deposit().call()
    await this.party.methods.register().send({
      from: account,
      gas: 120000,
      value: deposit
    })
    console.log(
      `New rsvp ${account} at party '${this.meta.name}'at address: ${
        this.party._address
      }`
    )
  }
}

async function seed() {
  const ethereumEndpoint = 'http://localhost:8545'
  const provider = new Web3.providers.HttpProvider(ethereumEndpoint)
  const web3 = new Web3(provider)
  const accounts = await web3.eth.getAccounts()

  const party1 = new DummyParty(web3, accounts[0], {
    name: 'Super duper'
  })
  await party1.deploy()
  await party1.rsvp(accounts[1])
  await party1.rsvp(accounts[2])

  const party2 = new DummyParty(web3, accounts[0], {
    name: 'Super duper 2'
  })
  await party2.deploy()
  await party2.rsvp(accounts[1])
  await party2.rsvp(accounts[2])
}

seed()
