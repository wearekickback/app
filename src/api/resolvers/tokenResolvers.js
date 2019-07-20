import getWeb3, { getAccount } from '../web3'
import { Token } from '@wearekickback/contracts'
import { txHelper } from '../utils'
export const defaults = {}
const abi = Token.abi

const resolvers = {
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
