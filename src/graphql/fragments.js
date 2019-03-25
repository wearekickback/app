import gql from 'graphql-tag'

export const ProfileFields = gql`
  fragment ProfileFields on UserProfile {
    id
    address
    username
    realName
    roles
    social {
      type
      value
    }
    legal {
      id
      type
      accepted
    }
    email {
      verified
      pending
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
    id
    address
    name
    description
    timezone
    start
    end
    arriveBy
    location
    headerImg
    balance
    deposit
    coolingPeriod
    participantLimit
    ended
    cancelled
    roles {
      role
      user {
        ...ProfileFields
      }
    }
    participants {
      ...ParticipantFields
    }
  }
`
