import getWeb3, { getAccount, getTokenBySymbol, getWeb3Read } from '../web3'
// import { Token } from '@wearekickback/contracts'

import { txHelper, isEmptyAddress } from '../utils'
export const defaults = {}
// This is because some token uses string as symbol while others are bytes32
// We need some workaround like https://ethereum.stackexchange.com/questions/58945/how-to-handle-both-string-and-bytes32-method-returns when supporting any ERC20

const detailedERC20ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'who', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_symbol', type: 'string' },
      { name: '_decimals', type: 'uint8' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  }
]

const detailedERC20bytes32ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'who', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_symbol', type: 'string' },
      { name: '_decimals', type: 'uint8' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  }
]

let token

const getTokenContract = (web3, address, abi) => {
  return new web3.eth.Contract(abi, address).methods
}

const resolvers = {
  Query: {
    async getTokenBySymbol(_, { symbol }) {
      const address = await getTokenBySymbol(symbol)
      return { address }
    },
    async getTokenAllowance(_, { tokenAddress, partyAddress }) {
      const web3 = await getWeb3Read()
      const account = await getAccount()

      try {
        // If token is Ether then give ether balance as allowance
        if (isEmptyAddress(tokenAddress)) {
          const balance = await web3.eth.getBalance(account)
          return {
            balance,
            account,
            allowance: balance
          }
        }

        const contract = getTokenContract(web3, tokenAddress, detailedERC20ABI)
        const allowance = await contract.allowance(account, partyAddress).call()
        const balance = await contract.balanceOf(account).call()
        return { allowance, balance, account }
      } catch (err) {
        console.log('Failed to fetch tokenAllowance', err)
        return { allowance: null, balance: null, account: null }
      }
    },
    async getTokenDecimals(_, { tokenAddress }) {
      if (isEmptyAddress(tokenAddress)) {
        return { decimals: 18 } //Ethereum
      }
      const web3 = await getWeb3Read()

      try {
        const contract = getTokenContract(web3, tokenAddress, detailedERC20ABI)
        const decimals = await contract.decimals().call()
        return { decimals }
      } catch (err) {
        throw new Error(
          `Failed to get Token Decimals (tokenAddress: ${tokenAddress})`
        )
      }
    },
    async getToken(_, { tokenAddress }) {
      if (token) return token
      if (isEmptyAddress(tokenAddress)) {
        return {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        }
      } else if (
        tokenAddress === '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
      ) {
        // Fudge name and symbol for DAI v1 (SAI) to prevent confusion
        return {
          name: 'Sai Stablecoin',
          symbol: 'SAI',
          decimals: 18
        }
      }
      const web3 = await getWeb3Read()

      try {
        const contract = getTokenContract(web3, tokenAddress, detailedERC20ABI)
        let [name, symbol, decimals] = await Promise.all([
          contract.name().call(),
          contract.symbol().call(),
          contract.decimals().call()
        ])
        return { name, symbol, decimals }
      } catch (err) {
        try {
          const contract = getTokenContract(
            web3,
            tokenAddress,
            detailedERC20bytes32ABI
          )
          let [name, symbol, decimals] = await Promise.all([
            contract.name().call(),
            contract.symbol().call(),
            contract.decimals().call()
          ])

          // To fit in a bytes32 on the contract, token name and symbol
          // have been padded to length using null characters.
          // We then strip these characters using the regex `/\u0000/g`
          const NULL_CHAR = '\u0000'
          name = web3.utils.toAscii(name).replace(`/${NULL_CHAR}/g`, '') // eslint-disable-line no-control-regex
          symbol = web3.utils.toAscii(symbol).replace(`/${NULL_CHAR}/g`, '') // eslint-disable-line no-control-regex
          return { name, symbol, decimals }
        } catch (err) {
          throw new Error(`Failed to get Token`)
        }
      }
    }
  },
  Mutation: {
    async approveToken(_, { tokenAddress, deposit, address }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const contract = getTokenContract(web3, tokenAddress, detailedERC20ABI)
      try {
        const tx = await txHelper(
          contract.approve(address, deposit).send({
            from: account
          })
        )

        return tx
      } catch (err) {
        console.error(err)

        throw new Error(`Failed to approve`)
      }
    }
  }
}

export default resolvers
