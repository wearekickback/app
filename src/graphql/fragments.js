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

export const ParticipantFields = gql`
  ${ProfileFields}

  fragment ParticipantFields on Participant {
    user {
      ...ProfileFields
    }
    status
    index
  }
`

export const PartyFields = gql`
  ${ProfileFields}
  ${ParticipantFields}

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
      ...ParticipantFields
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
