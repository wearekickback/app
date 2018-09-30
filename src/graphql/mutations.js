import gql from 'graphql-tag'


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

export const UpdateUserProfile = gql`
  mutation updateUserProfile($profile: UserProfileInput!) {
    profile: updateUserProfile(profile: $profile) @auth {
      created
      address
      social {
        type
        value
      }
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
