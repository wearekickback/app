#!/usr/bin/env node
const program = require('commander')

const fs = require('fs')
const gqlr = require('graphql-request')
const { GraphQLClient } = gqlr

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

// eg: scripts/checkWithdraw.js -a tmp/addresses.out -p 0x4905b4f22d8cdb0a035b17062e2d498b662991bc --mainnet
program
  .usage('[options]')
  .option('-p, --partyid <id>', 'Party ETH address')
  .option('-a, --addresses <addresses>', 'a file which contains addresses')
  .option('--ropsten', 'Use Ropsten instead of local development network')
  .option('--rinkeby', 'Use Rinkeby instead of local development network')
  .option('--mainnet', 'Use Mainnet instead of local development network')
  .parse(process.argv)

const address_file = program.addresses
const address = program.partyid

const addresses = fs
  .readFileSync(address_file, 'utf8')
  .split('\n')
  .map(a => a.toLowerCase())
const ropsten = program.ropsten
const rinkeby = program.rinkeby
const mainnet = program.mainnet

const network = ropsten
  ? 'ropsten'
  : mainnet
  ? 'live'
  : rinkeby
  ? 'rinkeby'
  : null

async function init() {
  const endpoint = `https://${network}.api.kickback.events/graphql`
  console.log(
    `
  Config
  ------
  Endpoint:               ${endpoint}
  Party id:               ${address}
  Addresses:              ${addresses.length} addresses in ${address_file}
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

init().then(result => {
  const disrepancy = 0
  const array = result.participants.map(r => {
    var status = r.status
    var username = r.user.username
    var address = r.user.address
    var withdrawn = addresses.includes(address)
    if (['REGISTERED', 'SHOWED_UP'].includes(status) && withdrawn) {
      console.log(`${username} is ${status} but already withdrawn`)
    }
    if (['WITHDRAWN_PAYOUT'].includes(status) && !withdrawn) {
      console.log(`${username} is ${status} but NOT withdrawn yet`)
    }
    return [status, username, address, withdrawn].join(',')
  })
  const outputfile = 'tmp/array.csv'
  console.log(`Saving the result into ${outputfile}`)
  fs.writeFileSync(outputfile, array.join('\n'))
})
