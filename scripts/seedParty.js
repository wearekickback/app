const jwt = require('jsonwebtoken')
const Web3 = require('web3')
const gqlr = require('graphql-request')
const { GraphQLClient } = gqlr
const EthVal = require('ethval')
const {
  Deployer: { abi }
} = require('@wearekickback/contracts')
const { DEPLOYER_CONTRACT_ADDRESS } = require('../src/config')

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

async function init() {
  const endpoint = 'http://localhost:3001/graphql'
  const ethereumEndpoint = 'http://localhost:8545'

  // create graphql client

  let client = new GraphQLClient(endpoint, { headers: {} })
  const provider = new Web3.providers.HttpProvider(ethereumEndpoint)
  const web3 = new Web3(provider)
  const accounts = await web3.eth.getAccounts()
  const tokens = []

  //request signMessage from server

  function requestChallenge(address) {
    return client.request(LoginChallenge, { address })
  }

  async function sign(challengeString, _address) {
    return web3.eth.sign(challengeString, _address)
  }

  const { createLoginChallenge } = await requestChallenge(accounts[0])

  const signature = await sign(createLoginChallenge.str, accounts[0])

  const AUTH = 'auth'
  const TOKEN_SECRET = 'kickback'
  const TOKEN_ALGORITHM = 'HS256'

  const token = jwt.sign(
    { address: accounts[0], sig: signature },
    TOKEN_SECRET,
    {
      algorithm: TOKEN_ALGORITHM
    }
  )

  console.log(token)

  client = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const user = await client.request(LoginUserNoAuth)

  const { id } = await client.request(PendingParty, {
    meta: {
      name: 'Awesome Party',
      description: 'description',
      date: '25th December',
      location: 'Some location',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUk7ni2PYcBZ_qXOLriROqyiiZRGiCMfKnkdx_I1gTOVf3FPGQ'
    },
    password: ''
  })

  const deployer = new web3.eth.Contract(abi, DEPLOYER_CONTRACT_ADDRESS)

  const tx = await deployer.methods
    .deploy(
      id,
      new EthVal(0.02, 'eth').toWei().toString(16),
      new EthVal(100).toString(16),
      new EthVal(1).toString(16)
    )
    .send({
      gas: 4000000,
      from: accounts[0]
    })

  console.log(tx)

  //use token to mutate and create a new party
}

init()
