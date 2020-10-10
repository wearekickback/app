import gql from 'graphql-tag'

import { ProfileFields, ParticipantFields } from './fragments'

export const CREATE_PARTY = gql`
  mutation createParty(
    $id: String
    $deposit: String
    $decimals: String
    $limitOfParticipants: String
    $coolingPeriod: String
    $tokenAddress: String
  ) {
    create: createParty(
      id: $id
      deposit: $deposit
      decimals: $decimals
      limitOfParticipants: $limitOfParticipants
      coolingPeriod: $coolingPeriod
      tokenAddress: $tokenAddress
    ) @client @requireAuth
  }
`

export const CREATE_PENDING_PARTY = gql`
  mutation createPendingParty($meta: PartyMetaInput!, $password: String) {
    id: createPendingParty(meta: $meta, password: $password) @requireAuth
  }
`

export const UPDATE_EVENT_META = gql`
  mutation updatePartyMeta($address: String!, $meta: PartyMetaInput!) {
    updatePartyMeta(address: $address, meta: $meta) @requireAuth {
      name
    }
  }
`

export const CREATE_LOGIN_CHALLENGE = gql`
  mutation createLoginChallenge($address: String!) {
    challenge: createLoginChallenge(address: $address) {
      str
    }
  }
`

export const SIGN_CHALLENGE_STRING = gql`
  mutation signChallengeString($challengeString: String!) {
    signature: signChallengeString(challengeString: $challengeString) @client
  }
`

export const LOGIN_USER = gql`
  ${ProfileFields}

  mutation loginUser {
    profile: loginUser @requireAuth {
      ...ProfileFields
    }
  }
`

// we use this one for checking if user is signed in
export const LOGIN_USER_NO_AUTH = gql`
  ${ProfileFields}

  mutation loginUser {
    profile: loginUser @disableAuth {
      ...ProfileFields
    }
  }
`

export const UPDATE_USER_PROFILE = gql`
  ${ProfileFields}

  mutation updateUserProfile($profile: UserProfileInput!) {
    profile: updateUserProfile(profile: $profile) @requireAuth {
      ...ProfileFields
    }
  }
`

export const MARK_USER_ATTENDED = gql`
  ${ParticipantFields}

  mutation markUserAttended(
    $address: String!
    $participant: ParticipantInput!
  ) {
    updateParticipantStatus(address: $address, participant: $participant)
      @requireAuth {
      ...ParticipantFields
    }
  }
`

export const UNMARK_USER_ATTENDED = gql`
  ${ParticipantFields}

  mutation unmarkUserAttended(
    $address: String!
    $participant: ParticipantInput!
  ) {
    updateParticipantStatus(address: $address, participant: $participant)
      @requireAuth {
      ...ParticipantFields
    }
  }
`

export const RSVP_TO_EVENT = gql`
  mutation rsvp($twitter: String, $address: String) {
    rsvp(twitter: $twitter, address: $address) @client @requireAuth
  }
`

export const ADD_PARTY_ADMINS = gql`
  mutation addAdmins($address: String, $userAddresses: [String]) {
    addAdmins(address: $address, userAddresses: $userAddresses)
      @client
      @requireAuth
  }
`

export const FINALIZE = gql`
  mutation finalize($address: String, $maps: [String!]!) {
    finalize(address: $address, maps: $maps) @client @requireAuth
  }
`

export const WITHDRAW_PAYOUT = gql`
  mutation withdrawPayout($address: String!) {
    withdrawPayout(address: $address) @client
  }
`

export const SEND_AND_WITHDRAW_PAYOUT = gql`
  mutation sendAndwithdrawPayout(
    $addresse: String!
    $addresses: [String!]
    $values: [String!]
  ) {
    sendAndWithdrawPayout(
      address: $address
      addresses: $addresses
      values: $values
    ) @client
  }
`

export const SINGLE_UPLOAD = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file)
  }
`

export const APPROVE_TOKEN = gql`
  mutation approveToken(
    $tokenAddress: String
    $address: String
    $deposit: String
  ) {
    approveToken(
      tokenAddress: $tokenAddress
      address: $address
      deposit: $deposit
    ) @client
  }
`
