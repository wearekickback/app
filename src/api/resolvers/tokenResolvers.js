import getWeb3, { getAccount, getTokenBySymbol } from '../web3'
import { Token } from '@wearekickback/contracts'
import { txHelper, EMPTY_ADDRESS } from '../utils'
export const defaults = {}
const abi = Token.abi
let token

const resolvers = {
  Query: {
    async getTokenBySymbol(_, { symbol }) {
      const address = await getTokenBySymbol(symbol)
      return { address }
    },
    async getTokenAllowance(_, { tokenAddress, partyAddress }) {
      const web3 = await getWeb3()
      const { methods: contract } = new web3.eth.Contract(abi, tokenAddress)
      try {
        const account = await getAccount()
        const allowance = await contract.allowance(account, partyAddress).call()
        return { allowance }
      } catch (err) {
        console.log('Failed to fetch tokenAllowance', err)
        return { allowance: null }
      }
    },
    async getToken(_, { tokenAddress }) {
      if (token) {
        return token
      }

      if (!tokenAddress || tokenAddress === EMPTY_ADDRESS) {
        return {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        }
      }
      const web3 = await getWeb3()
      const { methods: contract } = new web3.eth.Contract(abi, tokenAddress)

      try {
        const name = await contract.name().call()
        const symbol = await contract.symbol().call()
        const demicals = await contract.decimals().call()
        token = {
          name: name,
          symbol: symbol,
          decimals: demicals
        }
        return token
      } catch (err) {
        throw new Error(`Failed to get Token`)
      }
    }
  },
  Mutation: {
    async approveToken(_, { tokenAddress, deposit, address }) {
      const web3 = await getWeb3()
      const account = await getAccount()
      const { methods: contract } = new web3.eth.Contract(abi, tokenAddress)
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
