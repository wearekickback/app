import gql from 'graphql-tag'

import { ProfileFields, PartyFields } from './fragments'

export const NETWORK_ID_QUERY = gql`
  query getNetworkId {
    networkId: networkId @disableAuth
  }
`

export const CHECK_IF_USERNAME_IS_AVAILABLE_QUERY = gql`
  query isUsernameAvailable($username: String!) {
    available: isUsernameAvailable(username: $username)
  }
`

export const LEGAL_AGREEMENTS_QUERY = gql`
  query getLegalAgreements {
    legal: legalAgreements {
      id
      type
    }
  }
`

export const USER_PROFILE_QUERY = gql`
  ${ProfileFields}

  query getUserProfile($address: String!) {
    profile: userProfile(address: $address) {
      ...ProfileFields
    }
  }
`

export const PARTY_QUERY = gql`
  ${PartyFields}

  query getParty($address: String!) {
    party(address: $address) {
      ...PartyFields
    }
  }
`

export const PARTY_ADMIN_VIEW_QUERY = gql`
  ${PartyFields}

  query getPartyAdminView($address: String!) {
    partyAdminView(address: $address) {
      ...PartyFields
    }
  }
`

export const ALL_PARTIES_QUERY = gql`
  ${PartyFields}

  query getParties {
    parties: allParties {
      ...PartyFields
    }
  }
`

export const REVERSE_RECORD_QUERY = gql`
  query getReverseRecord($address: String) {
    getReverseRecord(address: $address) @client {
      name
      address
    }
  }
`

export const QR_SUPPORTED_QUERY = gql`
  query scanQRCodeSupported {
    supported: scanQRCodeSupported @client
  }
`

export const QR_QUERY = gql`
  query scanQRCode {
    qrCode: scanQRCode @client
  }
`
