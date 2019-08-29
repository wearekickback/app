#!/usr/bin/env node
const fs = require('fs')
const Web3 = require('web3')
const program = require('commander')
const { networks } = require('@wearekickback/contracts/truffle-config.js')

// eg: scripts/multisend.js -a tmp/notwithdrawn.csv -v 0.0001 -g 2 --rinkeby
program
  .usage('[options]')
  .option('-a, --addresses <addresses>', 'a file which contains addresses')
  .option('-v, --value <value>', 'ETH amount to refund')
  .option('-g, --gasPrice <gasPrice>', 'gwei amount of gasPrice')
  .option('--ropsten', 'Use Ropsten instead of local development network')
  .option('--rinkeby', 'Use Rinkeby instead of local development network')
  .option('--kovan', 'Use Kovan instead of local development network')
  .option('--mainnet', 'Use Mainnet instead of local development network')
  .parse(process.argv)

const ropsten = program.ropsten
const rinkeby = program.rinkeby
const kovan = program.kovan
const mainnet = program.mainnet
const gasPrice = program.gasPrice

const network = ropsten
  ? 'ropsten'
  : mainnet
  ? 'live'
  : rinkeby
  ? 'rinkeby'
  : kovan
  ? 'kovan'
  : null

const addressFile = program.addresses
const value = program.value
const addresses = fs
  .readFileSync(addressFile, 'utf8')
  .split('\n')
  .map(a => {
    return a.split(',')[0]
  })
  .filter(a => {
    return a !== ''
  })

const num = addresses.length

if (!network) {
  throw new Error('Network not specified')
}

// mutlisend contract address are all the same
// https://etherscan.io/address/0x5fcc77ce412131daeb7654b3d18ee89b13d86cbf#code
// https://www.reddit.com/r/ethereum/comments/8m8uk3/how_to_easily_send_eth_payments_to_500_different/dzm9y04/
const address = '0x5fcc77ce412131daeb7654b3d18ee89b13d86cbf'
const abi = [
  {
    constant: false,
    inputs: [
      { name: '_addresses', type: 'address[]' },
      { name: '_amounts', type: 'uint256[]' }
    ],
    name: 'multiCall',
    outputs: [{ name: '', type: 'bool' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_addresses', type: 'address[]' },
      { name: '_amounts', type: 'uint256[]' }
    ],
    name: 'multiTransfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'escapeHatchCaller',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_addressesAndAmounts', type: 'bytes32[]' }],
    name: 'multiTransferTightlyPacked',
    outputs: [{ name: '', type: 'bool' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newOwner', type: 'address' }],
    name: 'changeOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_token', type: 'address' },
      { name: '_addresses', type: 'address[]' },
      { name: '_amounts', type: 'uint256[]' }
    ],
    name: 'multiERC20Transfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_dac', type: 'address' }],
    name: 'removeOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newOwnerCandidate', type: 'address' }],
    name: 'proposeOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_token', type: 'address' }],
    name: 'isTokenEscapable',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_token', type: 'address' }],
    name: 'escapeHatch',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_addressesAndAmounts', type: 'bytes32[]' }],
    name: 'multiCallTightlyPacked',
    outputs: [{ name: '', type: 'bool' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'newOwnerCandidate',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newEscapeHatchCaller', type: 'address' }],
    name: 'changeHatchEscapeCaller',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'escapeHatchDestination',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_token', type: 'address' },
      { name: '_addressesAndAmounts', type: 'bytes32[]' }
    ],
    name: 'multiERC20TransferTightlyPacked',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      { indexed: true, name: '_value', type: 'uint256' },
      { indexed: false, name: '_to', type: 'address' },
      { indexed: false, name: '_amount', type: 'uint256' }
    ],
    name: 'MultiTransfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      { indexed: true, name: '_value', type: 'uint256' },
      { indexed: false, name: '_to', type: 'address' },
      { indexed: false, name: '_amount', type: 'uint256' }
    ],
    name: 'MultiCall',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      { indexed: true, name: '_value', type: 'uint256' },
      { indexed: false, name: '_to', type: 'address' },
      { indexed: false, name: '_amount', type: 'uint256' },
      { indexed: false, name: '_token', type: 'address' }
    ],
    name: 'MultiERC20Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: 'token', type: 'address' }],
    name: 'EscapeHatchBlackistedToken',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'token', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' }
    ],
    name: 'EscapeHatchCalled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'by', type: 'address' },
      { indexed: true, name: 'to', type: 'address' }
    ],
    name: 'OwnershipRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'OwnershipRemoved', type: 'event' }
]

async function init() {
  if (ropsten) {
    provider = networks.ropsten.provider()
  } else if (rinkeby) {
    provider = networks.rinkeby.provider()
  } else if (mainnet) {
    provider = networks.mainnet.provider()
  }
  const sender = provider.addresses[0]
  const web3 = new Web3(provider)
  const mulitSend = new web3.eth.Contract(abi, address)
  const valueInWei = web3.utils.toWei(value, 'ether')
  const totalValueInWei = (num * valueInWei).toString()
  const totalValue = web3.utils.fromWei(totalValueInWei, 'ether')

  const gasPriceInWei = web3.utils.toWei(gasPrice, 'gwei')
  const values = addresses.map(() => {
    return valueInWei
  })

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
      : 'development'
  }
  Addresses:              ${addresses.length} addresses in ${addressFile}
  Sender:                 ${sender}
  GasPrice Value:         ${gasPrice} gwei (${gasPriceInWei} wei)
  Refund Value:           ETH ${value} (${valueInWei} wei)
  Total Refund value:     ETH ${totalValue} (${totalValueInWei} wei)
  `
  )
  const tx = await mulitSend.methods.multiTransfer(addresses, values).send({
    from: sender,
    value: totalValueInWei,
    gasPrice: gasPriceInWei
  })
  console.log('end', { tx })
  process.exit(0)
}

init()
