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
    createdAt
    location
    headerImg
    balance
    deposit
    tokenAddress
    symbol
    decimals
    coolingPeriod
    participantLimit
    ended
    finalizedAt
    cancelled
    status
    clearFee
    withdrawn
    ownerAddress
    optional
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
    eventsContributed {
      amount
      createdAt
      recipientUsername
      name
      partyAddress
      decimals
      symbol
    }
    eventsContributionReceived {
      amount
      createdAt
      senderUsername
      name
      partyAddress
      decimals
      symbol
    }
  }
`
