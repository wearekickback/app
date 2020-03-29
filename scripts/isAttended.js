#!/usr/bin/env node
const program = require('commander')

const fs = require('fs')
const gqlr = require('graphql-request')
const { GraphQLClient } = gqlr
const Web3 = require('web3')

const { networks } = require('@wearekickback/contracts/truffle-config.js')
const { Conference } = require('@wearekickback/contracts')
const {
  Conference: { abi: ConferenceABI }
} = require('@wearekickback/contracts')

const GetParty = `
  query getParty($address: String!) {
    party(address: $address) {
      id
      address
      name
      ended
      participants{
        status
        index
        user{
          username
          address
        }
      }
    }
  }
`

// eg: scripts/checkWithdraw.js -p 0x4905b4f22d8cdb0a035b17062e2d498b662991bc --mainnet
program
  .usage('[options]')
  .option('-p, --partyid <id>', 'Party ETH address')
  .option('--ropsten', 'Use Ropsten instead of local development network')
  .option('--rinkeby', 'Use Rinkeby instead of local development network')
  .option('--mainnet', 'Use Mainnet instead of local development network')
  .parse(process.argv)

const address = program.partyid
const partyId = address
const ropsten = program.ropsten
const rinkeby = program.rinkeby
const mainnet = program.mainnet
const kovan = program.kovan

const network = ropsten
  ? 'ropsten'
  : mainnet
  ? 'live'
  : rinkeby
  ? 'rinkeby'
  : kovan
  ? 'kovan'
  : null

let provider = new Web3.providers.HttpProvider(
  `http://${networks.development.host}:${networks.development.port}`
)

if (ropsten) {
  provider = networks.ropsten.provider()
} else if (rinkeby) {
  provider = networks.rinkeby.provider()
} else if (kovan) {
  provider = networks.kovan.provider()
} else if (mainnet) {
  provider = networks.mainnet.provider()
}
const web3 = new Web3(provider)

async function init() {
  const endpoint = `https://${network}.api.kickback.events/graphql`
  console.log(
    `
  Config
  ------
  Endpoint:               ${endpoint}
  Party id:               ${address}
  `
  )

  client = new GraphQLClient(endpoint, {
    headers: {
      Authorization: ``
    }
  })
  const { party } = await this.client.request(GetParty, { address })
  return party
}

async function main() {
  const notWithdrawn = []
  const partyContract = new web3.eth.Contract(Conference.abi, partyId)
  const registered = await partyContract.methods.registered().call()
  const array = []
  for (let index = 0; index < registered; index++) {
    // let r = result.participants[index]
    const element = array[index]
    let address = await partyContract.methods.participantsIndex(index).call()
    let isAttended = await partyContract.methods.isAttended(address).call()
    let participant = await partyContract.methods.participants(address).call()
    // console.log({username, status, isAttended })
    // if (['SHOWED_UP'].includes(status) && !isAttended) {
    //   console.log(`${username} is ${status} but not marked as attended`)
    // }

    // console.log([participant.index, address, status,  isAttended? 1 : 0 , withdrawn? 1 : 0].join(','))
    // console.log([participant.index, address, status,  isAttended? 1 : 0 ].join(','))
    console.log([participant.index, address, isAttended ? 1 : 0].join(','))
    // array.push([status, username, address, withdrawn].join(','))
  }
  const outputfile = 'tmp/array.csv'
  const notwithdrawnfile = 'tmp/notwithdrawn.csv'
  console.log(`Saving all the result into ${outputfile}`)
  console.log(`Saving not withdrawn into ${notwithdrawnfile}`)
  fs.writeFileSync(outputfile, array.join('\n'))
  fs.writeFileSync(notwithdrawnfile, notWithdrawn.join('\n'))
}

main()
