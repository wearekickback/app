// import getWeb3 from '../web3'
export const defaults = {}

const resolvers = {
  Query: {
    async scanQRCodeSupported(_, { address }) {
      // const web3 = await getWeb3()
      console.log('Query:scanQRCodeSupported', address)
      return {
        supported:true,
        __typename: 'QRCodeSupported'
      }
    }
  },
  Mutation: {
    async scanQRCode(_, { }) {
      return {
        address:'0x6d8bd81fc3838469a95e28e7f2813cd2764d1461',
        __typename: 'QRCode'
      }
      // const web3 = await getWeb3()
      // const account = await getAccount()
      // const { methods: contract } = new web3.eth.Contract(abi, address)
      // const deposit = await contract.deposit().call()
      // try {
      //   const tx = await contract.register().send({
      //     from: account,
      //     value: deposit
      //   })

      //   return tx
      // } catch (err) {
      //   console.error(err)

      //   throw new Error(`Failed to RSVP`)
      // }
    }
  }
}

export default resolvers
