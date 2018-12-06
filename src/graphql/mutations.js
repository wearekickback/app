import gql from 'graphql-tag'

import { ProfileFields, ParticipantFields } from './fragments'

export const CreateParty = gql`
  mutation createParty(
    $id: String
    $deposit: String
    $limitOfParticipants: String
    $coolingPeriod: String
  ) {
    create: createParty(
      id: $id
      deposit: $deposit
      limitOfParticipants: $limitOfParticipants
      coolingPeriod: $coolingPeriod
    ) @client @requireAuth
  }
`

export const CreatePendingParty = gql`
  mutation createPendingParty($meta: PartyMetaInput!, $password: String) {
    id: createPendingParty(meta: $meta, password: $password) @requireAuth
  }
`

export const UpdatePartyMeta = gql`
  mutation updatePartyMeta($address: String!, $meta: PartyMetaInput!) {
    updatePartyMeta(address: $address, meta: $meta) @requireAuth {
      name
    }
  }
`

export const CreateLoginChallenge = gql`
  mutation createLoginChallenge($address: String!) {
    challenge: createLoginChallenge(address: $address) {
      str
    }
  }
`

export const SignChallengeString = gql`
  mutation signChallengeString($challengeString: String!) {
    signature: signChallengeString(challengeString: $challengeString) @client
  }
`

export const LoginUser = gql`
  ${ProfileFields}

  mutation loginUser {
    profile: loginUser @requireAuth {
      ...ProfileFields
    }
  }
`

// we use this one for checking if user is signed in
export const LoginUserNoAuth = gql`
  ${ProfileFields}

  mutation loginUser {
    profile: loginUser @disableAuth {
      ...ProfileFields
    }
  }
`

export const UpdateUserProfile = gql`
  ${ProfileFields}

  mutation updateUserProfile($profile: UserProfileInput!) {
    profile: updateUserProfile(profile: $profile) @requireAuth {
      ...ProfileFields
    }
  }
`

export const MarkUserAttended = gql`
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

export const UnmarkUserAttended = gql`
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

export const RsvpToEvent = gql`
  mutation rsvp($twitter: String, $address: String) {
    rsvp(twitter: $twitter, address: $address) @client @requireAuth
  }
`

export const AddPartyAdmins = gql`
  mutation addAdmins($address: String, $userAddresses: [String]) {
    addAdmins(address: $address, userAddresses: $userAddresses)
      @client
      @requireAuth
  }
`

export const Finalize = gql`
  mutation finalize($address: String, $maps: [String!]!) {
    finalize(address: $address, maps: $maps) @client @requireAuth
  }
`

export const WithdrawPayout = gql`
  mutation withdrawPayout($address: String!) {
    withdrawPayout(address: $address) @client
  }
`
