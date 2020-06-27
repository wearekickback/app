import getWeb3, { getAccount, getTokenBySymbol, getWeb3Read } from '../web3'
// import { Token } from '@wearekickback/contracts'

import DETAILEDERC20_ABI from '../abi/detailedERC20ABI'
import { txHelper, isEmptyAddress } from '../utils'
export const defaults = {}

const getTokenContract = (web3, address, abi) => {
  return new web3.eth.Contract(abi, address).methods
}

const resolvers = {
  Query: {
    async getTokenBySymbol(_, { symbol }) {
      const address = await getTokenBySymbol(symbol)
      return { address }
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
