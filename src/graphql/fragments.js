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

export const DonationFields = gql`
  fragment DonationFields on Donation {
    name
    category
    note
    amount
    beneficiaryAddress
  }
`

export const PartyFields = gql`
  ${ProfileFields}
  ${ParticipantFields}
  ${DonationFields}
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
    tokenAddress
    coolingPeriod
    participantLimit
    ended
    cancelled
    status
    roles {
      role
      user {
        ...ProfileFields
      }
    }
    participants {
      ...ParticipantFields
    }
    donations {
      ...DonationFields
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
