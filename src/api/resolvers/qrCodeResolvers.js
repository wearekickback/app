import getWeb3 from '../web3'
export const defaults = {}

const resolvers = {
  Query: {
export const QRSupportedQuery = gql`
  query scanQRCodeSupported {
    supported: scanQRCodeSupported @client
  }
      const web3 = await getWeb3()
      return {
        supported:!!web3.currentProvider.scanQRCode,
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
