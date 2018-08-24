const typeDefs = `
  # Root resolver
  type Web3 {
    accounts: [String]
  }

  type Transaction {
    id: String
    createdAt: String
  }

  type Query {
    web3: Web3
  }
`

export default typeDefs
