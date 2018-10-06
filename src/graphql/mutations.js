import gql from 'graphql-tag'

import { ProfileFields, ParticipantFields } from './fragments'

export const CreateParty = gql`
  mutation create($name: String, $deposit: String, $limitOfParticipants: String) {
    create(name: $name, deposit: $deposit, limitOfParticipants: $limitOfParticipants) @client @auth
  }
`

export const UpdatePartyMeta = gql`
  mutation updatePartyMeta($address: String!, $meta: PartyMetaInput!) {
    updatePartyMeta(address: $address, meta: $meta) @auth
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
    profile: loginUser @auth {
      ...ProfileFields
    }
  }
`

export const UpdateUserProfile = gql`
  ${ProfileFields}

  mutation updateUserProfile($profile: UserProfileInput!) {
    profile: updateUserProfile(profile: $profile) @auth {
      ...ProfileFields
    }
  }
`


export const MarkUserAttended = gql`
  ${ParticipantFields}

  mutation markUserAttended($address: String!, $participant: ParticipantInput!) {
    updateParticipantStatus(address: $address, participant: $participant) @auth {
      ...ParticipantFields
    }
  }
`

export const UnmarkUserAttended = gql`
  ${ParticipantFields}

  mutation unmarkUserAttended($address: String!, $participant: ParticipantInput!) {
    updateParticipantStatus(address: $address, participant: $participant) @auth {
      ...ParticipantFields
    }
  }
`


export const RsvpToEvent = gql`
  mutation rsvp($twitter: String, $address: String) {
    rsvp(twitter: $twitter, address: $address) @client @auth
  }
`
