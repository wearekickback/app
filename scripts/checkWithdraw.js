#!/usr/bin/env node
const program = require('commander')

const fs = require('fs')
const gqlr = require('graphql-request')
const { GraphQLClient } = gqlr
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

const {
  Conference: { abi: ConferenceABI }
} = require('@wearekickback/contracts')

const GetGraphParty = `
query getGraphParty($address: String!, $participantsLength: Int!){
	partyEntity(id:$address){
    id
    payout
    deposit
  }
  participantEntities(first:$participantsLength, where:{partyAddress: $address}){
    partyAddress
    userAddress
    state
  }
}
`

const GetParty = `
  query getParty($address: String!) {
    party(address: $address) {
      id
      address
      tokenAddress
      name
      ended
      deposit
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

// eg: scripts/checkWithdraw.js (-a tmp/addresses.out) -p 0x4905b4f22d8cdb0a035b17062e2d498b662991bc --mainnet
// eg: example to run in bulk
// for VARIABLE in 0x35aa6c01e4b948231a6202456658acd07518608e 0x301bd8451d5b2046e612e829f8f951915bf14a96 0x34f1006a9ffbad48bc12a496f672d13635496839 0xec17440c8a02570807aea2069724736156fd3aa6 0x837e35f3233e6539c9376809e895761d755276f0 0x2cbdfb038afb5ed69c65af987c80d5ec6e3ea4f9 0xc405b40a81414a39c572d01ef4ea7acc4e521fd9 0xe5e15e07cd4d5e4ffcd75703e8aaba8f34661bed 0xb7bbb5f9ada8568e6968fc3f70817d78bb7d1260 0xa2039e8af4dbb8f3a31580a024dd44b4b6513b16 0x6941bd02a7662f1c2d7bb2daf578328e385dda66 0xefad0dffa6130bdbe2188ac6611cd2e718b0f3eb 0x3eff4434708128babca34714f5ec97da5a98c621
// do
//     echo $VARIABLE
// 	   scripts/checkWithdraw.js   --mainnet -p  $VARIABLE
//     cat tmp/notwithdrawn.csv >> tmp/refund.csv
//     sleep 1
// done
program
  .usage('[options]')
  .option('-p, --partyid <id>', 'Party ETH address')
  .option('-a, --addresses <addresses>', 'a file which contains addresses')
  .option('--ropsten', 'Use Ropsten instead of local development network')
  .option('--rinkeby', 'Use Rinkeby instead of local development network')
  .option('--mainnet', 'Use Mainnet instead of local development network')
  .parse(process.argv)

const address = program.partyid
const address_file = program.addresses
let addresses
if (address_file) {
  addresses = fs.readFileSync(address_file, 'utf8').split('\n')
}

const ropsten = program.ropsten
const rinkeby = program.rinkeby
const mainnet = program.mainnet

const network = ropsten
  ? 'ropsten'
  : mainnet
  ? 'live'
  : rinkeby
  ? 'rinkeby'
  : kovan
  ? 'kovan'
  : null

async function init() {
  const endpoint = `https://${network}.api.kickback.events/graphql`
  const graphEndpoint =
    'https://api.thegraph.com/subgraphs/name/makoto/kickback-subgraph'
  console.log(
    `
  Config
  ------
  Endpoint:               ${endpoint}
  Graph Endpoint:         ${graphEndpoint}
  Party id:               ${address}
  `
  )

  client = new GraphQLClient(endpoint, {
    headers: {
      Authorization: ``
    }
  })
  const graph = new GraphQLClient(graphEndpoint, {
    headers: {
      Authorization: ``
    }
  })

  const { party } = await this.client.request(GetParty, { address })
  const participantsLength = party.participants.length
  const graphParty = await graph.request(GetGraphParty, {
    address,
    participantsLength
  })
  return { party, graphParty }
}
init().then(({ party, graphParty }) => {
  const notWithdrawn = []
  if (party.participants.length !== graphParty.participantEntities.length) {
    throw `Participant numbers do not match (${party.participants.length} !== ${
      graphParty.participantEntities.length
    })`
  }
  if (!addresses) {
    addresses = graphParty.participantEntities
      .filter(a => a.state === 'WITHDRAWN')
      .map(a => a.userAddress)
  }

  const array = party.participants.map(r => {
    var status = r.status
    var username = r.user.username
    var address = r.user.address
    var withdrawn = addresses.map(a => a.toLowerCase()).includes(address)
    var payout = graphParty.partyEntity.payout

    var result = [status, username, address, withdrawn].join(',')
    if (['REGISTERED', 'SHOWED_UP'].includes(status) && withdrawn) {
      console.log(`*** ${username} is ${status} but already withdrawn`)
    }
    if (['WITHDRAWN_PAYOUT'].includes(status) && !withdrawn) {
      console.log(`*** ${username} is ${status} but NOT withdrawn yet`)
    }
    if (['SHOWED_UP'].includes(status) && !withdrawn) {
      let tokenAddress = party.tokenAddress || EMPTY_ADDRESS
      notWithdrawn.push(
        [
          `"${party.name}"`,
          party.address,
          tokenAddress,
          payout,
          address,
          username
        ].join(',')
      )
    }
    return [status, username, address, withdrawn].join(',')
  })
  const outputfile = 'tmp/array.csv'
  const notwithdrawnfile = 'tmp/notwithdrawn.csv'
  console.log(`Saving all the result into ${outputfile}`)
  console.log(`Saving not withdrawn into ${notwithdrawnfile}`)
  console.log('notWithdrawn', notWithdrawn.map(a => a + '\n'))
  fs.writeFileSync(outputfile, array.join('\n'))
  fs.writeFileSync(notwithdrawnfile, notWithdrawn.join('\n') + '\n')
})
