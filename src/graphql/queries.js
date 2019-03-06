import gql from 'graphql-tag'

import { ProfileFields, PartyFields } from './fragments'

export const NetworkIdQuery = gql`
  query getNetworkId {
    networkId: networkId @disableAuth
  }
`

export const CheckIfUsernameIsAvailableQuery = gql`
  query isUsernameAvailable($username: !String) {
    available: isUsernameAvailable(username: $username)
  }
`

export const LegalAgreementsQuery = gql`
  query getLegalAgreements {
    legal: legalAgreements {
      id
      type
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

export const PartyAdminViewQuery = gql`
  ${PartyFields}

  query getPartyAdminView($address: String!) {
    partyAdminView(address: $address) {
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

export const ReverseRecordQuery = gql`
  query getReverseRecord($address: String) {
    getReverseRecord(address: $address) @client {
      name
      address
    }
  }
`

export const QRSupportedQuery = gql`
  query scanQRCodeSupported {
    supported: scanQRCodeSupported @client
  }
`

export const QRQuery = gql`
  query scanQRCode {
    qrCode: scanQRCode @client
  }
`
