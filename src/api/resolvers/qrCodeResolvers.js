import getWeb3 from '../web3'
export const defaults = {}

const resolvers = {
  Query: {
    async scanQRCodeSupported() {
      const web3 = await getWeb3()
      return !!web3.currentProvider.scanQRCode
    },
    async scanQRCode() {
      const web3 = await getWeb3()
      try {
        const data = await web3.currentProvider.scanQRCode()
        window.alert(data)
        return data
      } catch (err) {
        throw new Error(`Failed to scan QR code`)
      }
    }
  }
}

export default resolvers
