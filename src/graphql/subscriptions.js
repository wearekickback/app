import gql from 'graphql-tag'

export const TransactionStatusSubscription = gql`
  subscription getTransactionStatus($tx: TransactionInput!) {
    transactionStatus(tx: $tx) @client {
      inProgress
      percentComplete
      numConfirmations
      succeeded
      failed
    }
  }
`
