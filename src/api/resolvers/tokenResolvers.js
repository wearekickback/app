import getWeb3, {
  getAccount,
  getTokenBySymbol,
  getWeb3Read,
  getWeb3ForNetwork
} from '../web3'
// import { Token } from '@wearekickback/contracts'

import DETAILEDERC20_ABI from '../abi/detailedERC20ABI'
import DETAILEDERC20BYTES32_ABI from '../abi/detailedERC20bytes32ABI'
import BALANCE_CHECKER_ABI from '../abi/balanceCheckerABI'

import { txHelper, isEmptyAddress } from '../utils'
export const defaults = {}
const BALANCE_CHECKER_ADDRESS = '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39'
const getTokenContract = (web3, address, abi) => {
  return new web3.eth.Contract(abi, address).methods
}

const resolvers = {
  Query: {
    async getTokenBySymbol(_, { symbol }) {
      const address = await getTokenBySymbol(symbol)
      return { address }
    },
    async getMainnetTokenBalance(_, { userAddresses, tokenAddress }) {
      const web3 = await getWeb3ForNetwork('1')
      const contract = getTokenContract(web3, tokenAddress, DETAILEDERC20_ABI)
      const symbol = await contract.symbol().call()
      const decimals = await contract.decimals().call()
      const balanceChecker = new web3.eth.Contract(
        BALANCE_CHECKER_ABI,
        BALANCE_CHECKER_ADDRESS
      ).methods
      let balances = await balanceChecker
        .balances(userAddresses, [tokenAddress])
        .call()

      return {
        balances,
        symbol,
        decimals
      }
    },
    async getTokenAllowance(_, { userAddress, tokenAddress, partyAddress }) {
      try {
        const web3 = await getWeb3Read()
        // If token is Ether then give ether balance as allowance
        if (isEmptyAddress(tokenAddress)) {
          const balance = await web3.eth.getBalance(userAddress)
          return {
            balance,
            allowance: balance
          }
        }

        const contract = getTokenContract(web3, tokenAddress, DETAILEDERC20_ABI)
        const allowance = await contract
          .allowance(userAddress, partyAddress)
          .call()
        const balance = await contract.balanceOf(userAddress).call()
        return { allowance, balance }
      } catch (err) {
        console.log('Failed to fetch tokenAllowance', err)
        return { allowance: null, balance: null }
      }
    },
    async getTokenDecimals(_, { tokenAddress }) {
      if (isEmptyAddress(tokenAddress)) {
        return { decimals: 18 } //Ethereum
      }
      const web3 = await getWeb3Read()

      try {
        const contract = getTokenContract(web3, tokenAddress, DETAILEDERC20_ABI)
        const decimals = await contract.decimals().call()
        return { decimals }
      } catch (err) {
        throw new Error(
          `Failed to get Token Decimals (tokenAddress: ${tokenAddress})`
        )
      }
    },
    async getClientToken(_, { tokenAddress }) {
      if (isEmptyAddress(tokenAddress)) {
        return {
          name: null,
          symbol: null,
          decimals: null
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
        const contract = getTokenContract(web3, tokenAddress, DETAILEDERC20_ABI)
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
            DETAILEDERC20BYTES32_ABI
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
          console.log('Failed to get Token')
          return { name: null, symbol: null, decimals: 18 }
        }
      }
    }
  },
  Mutation: {
    async approveToken(_, { tokenAddress, deposit, address }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const contract = getTokenContract(web3, tokenAddress, DETAILEDERC20_ABI)
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
