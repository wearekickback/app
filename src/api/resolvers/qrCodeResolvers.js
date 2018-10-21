import getWeb3 from '../web3'
export const defaults = {}

const resolvers = {
  Query: {
    async scanQRCodeSupported() {
      let supported = false;
      const web3 = await getWeb3()
      if(web3.currentProvider.scanQRCode){
        supported = true
      }
      return {
        supported:supported,
        __typename: 'QRCodeSupported'
      }
    },
    async scanQRCode() {
      const web3 = await getWeb3()
      try {
        const data = await web3.currentProvider.scanQRCode()
        return {
          address: data,
          __typename: 'QRCode'
        }
      } catch (err) {
        throw new Error(`Failed to scan QR code`)
      }
    }
  }
}

export default resolvers
