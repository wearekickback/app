import gql from 'graphql-tag'

import { ProfileFields } from './fragments'

export const CreateParty = gql`
  mutation create($name: String, $deposit: String, $limitOfParticipants: String) {
    create(name: $name, deposit: $deposit, limitOfParticipants: $limitOfParticipants) @client @auth
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


const MarkUserAttended = gql`
  mutation markUserAttended($address: String!, $attendee: AttendeeInput!) {
    updateAttendeeStatus(address: $address, attendee: $attendee)
  }
`

const UnmarkUserAttended = gql`
  mutation unmarkUserAttended($address: String!, $attendee: AttendeeInput!) {
    updateAttendeeStatus(address: $address, attendee: $attendee)
  }
`
