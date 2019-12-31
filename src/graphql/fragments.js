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

export const CampaignFields = gql`
  fragment CampaignFields on Campaign {
    name
    category
    note
    amount
    beneficiaryAddress
  }
`

export const ContributionFields = gql`
  fragment ContributionFields on Contribution {
    amount
    contributorAddress
    beneficiaryAddress
  }
`

export const PartyFields = gql`
  ${ProfileFields}
  ${ParticipantFields}
  ${CampaignFields}
  ${ContributionFields}
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
    campaigns {
      ...CampaignFields
    }
    contributions {
      ...ContributionFields
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
