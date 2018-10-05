import gql from 'graphql-tag'

import { ProfileFields } from './fragments'

export const EthersQuery = gql`
  query ethers {
    ethers @client {
      ethers
    }
  }
`

export const UserProfileQuery = gql`
  query getUserProfile($address: String!) {
    profile: userProfile(address: $address) {
      address
      social {
        type
        value
      }
      # if I am logged in then these following props will also get returned
      email {
        verified
        pending
      }
      legal {
        type
        accepted
      }
    }
  }
`

export const PartyQuery = gql`
  ${ProfileFields}

  query getParty($address: String) {
    party(address: $address) {
      address
      name
      description
      date
      location
      deposit
      coolingPeriod
      attendeeLimit
      attendees {
        user {
          ...ProfileFields,
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
  }
`

export const AllPartiesQuery = gql`
  query getParties {
    parties: activeParties {
      name
      address
      description
      date
      location
      deposit
      coolingPeriod
      attendeeLimit
      attendees
      owner {
        address
        social {
          type
          value
        }
      }
      admins {
        address
        social {
          type
          value
        }
      }
    }
  }
`

export const AllEventsQuery = gql`
  query getEvents {
    events @client {
      name
      address
    }
  }
`

export const GET_MARKED_ATTENDED_SINGLE = gql`
  query getMarkedAttendedSingle($contractAddress: String) {
    markAttendedSingle(contractAddress: $contractAddress) @client
  }
`

export const GET_MARKED_ATTENDED = gql`
  query getMarkedAttended {
    markedAttendedList @client
  }
`

export const ReverseRecordQuery = gql`
  query getReverseRecord($address: String) {
    getReverseRecord(address: $address) @client {
      name
      address
    }
  }
`
