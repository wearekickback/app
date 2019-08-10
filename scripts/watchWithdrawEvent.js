#!/usr/bin/env node

/* This script deploys a new party using the Deployer */

const fs = require('fs')
const Web3 = require('web3')
const program = require('commander')

const { networks } = require('@wearekickback/contracts/truffle-config.js')
const { Conference } = require('@wearekickback/contracts')

// eg: scripts/watchWithdrawEvent.js -p 0x4905b4f22d8cdb0a035b17062e2d498b662991bc -b 7000000 --mainne
program
  .usage('[options]')
  .option('-p, --partyid <id>', 'Party ETH address')
  .option('-b, --block <block>', 'Starting block number to watch events')
  .option('--ropsten', 'Use Ropsten instead of local development network')
  .option('--rinkeby', 'Use Rinkeby instead of local development network')
  .option('--kovan', 'Use Kovan instead of local development network')
  .option('--mainnet', 'Use Mainnet instead of local development network')
  .parse(process.argv)

const id = program.partyid
const block = program.block

if (!id) {
  throw new Error('Id not given')
}

const ropsten = program.ropsten
const rinkeby = program.rinkeby
const kovan = program.kovan
const mainnet = program.mainnet

console.log(
  `
Config
------
Network:                ${
    ropsten
      ? 'ropsten'
      : mainnet
      ? 'mainnet'
      : rinkeby
      ? 'rinkeby'
      : kovan
      ? 'kovan'
      : 'development'
  }
Party id:               ${id}
Starting block:         ${block}
`
)

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

const party = new web3.eth.Contract(Conference.abi, id)
let params = { fromBlock: block, toBlock: 'latest' }

party
  .getPastEvents('WithdrawEvent', params, (error, events) => {})
  .then(events => {
    var addresses = events.map(e => {
      return e.returnValues.addr
    })
    const outfile = 'tmp/addresses.out'
    console.log(`${addresses.length} addresses found. Saving into ${outfile}`)
    fs.writeFileSync(outfile, addresses.join('\n'))
    process.exit(0)
  })
