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

export const PartyFields = gql`
  ${ProfileFields}

  fragment PartyFields on Party {
    address
    name
    description
    date
    location
    image
    deposit
    coolingPeriod
    participantLimit
    participants {
      user {
        ...ProfileFields
      }
      status
      index
    }
    ended
    cancelled
    owner {
      ...ProfileFields
    }
    admins {
      ...ProfileFields
    }
  }
`
