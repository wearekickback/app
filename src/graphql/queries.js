import gql from 'graphql-tag'

import { ProfileFields, PartyFields } from './fragments'

export const EthersQuery = gql`
  query ethers {
    ethers @client {
      ethers
    }
  }
`

export const UserProfileQuery = gql`
  ${ProfileFields}

  query getUserProfile($address: String!) {
    profile: userProfile(address: $address) {
      ...ProfileFields
    }
  }
`

export const PartyQuery = gql`
  ${PartyFields}

  query getParty($address: String!) {
    party(address: $address) {
      ...PartyFields
    }
  }
`

export const AllPartiesQuery = gql`
  ${PartyFields}

  query getParties {
    parties: allParties {
      ...PartyFields
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

export const ReverseRecordQuery = gql`
  query getReverseRecord($address: String) {
    getReverseRecord(address: $address) @client {
      name
      address
    }
  }
`
