import gql from 'graphql-tag'


export const CreateParty = gql`
  mutation create($name: String, $deposit: String, $limitOfParticipants: String, ) {
    create(name: $name, deposit: $deposit, limitOfParticipants: $limitOfParticipants) @client @auth
  }
`
