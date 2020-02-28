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
    #server
    name
    description
    timezone
    start
    end
    arriveBy
    location
    headerImg
    id
    address

    #not needed to be synced by server
    balance
    deposit
    tokenAddress
    coolingPeriod
    participantLimit
    ended
    cancelled
    #

    status
    roles {
      role
      user {
        ...ProfileFields
      }
    }
    #remove when subgraph is up
    participants {
      ...ParticipantFields
    }
  }
`

export const ProfileFieldsDetailed = gql`
  ${ProfileFields}
  ${PartyFields}
  fragment ProfileFieldsDetailed on UserProfile {
    ...ProfileFields
    eventsAttended {
      ...PartyFields
    }
    eventsHosted {
      ...PartyFields
    }
  }
`
