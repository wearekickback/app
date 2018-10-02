import gql from 'graphql-tag'

export const ProfileFields = gql`
  fragment ProfileFields on UserProfile {
    address
    lastLogin
    created
    social {
      type
      value
    }
    email {
      verified
      pending
    }
    legal {
      type
      accepted
    }
  }
`
