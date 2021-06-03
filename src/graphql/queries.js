import gql from 'graphql-tag'

import { ProfileFields, ProfileFieldsDetailed, PartyFields } from './fragments'

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

export const IS_WHITELISTED = gql`
  query isWhitelisted($address: String!) {
    isWhitelisted: isWhitelisted(address: $address)
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

  query getUserProfile($address: String, $username: String) {
    profile: userProfile(address: $address, username: $username) {
      ...ProfileFields
    }
  }
`

export const USER_PROFILE_DETAILED_QUERY = gql`
  ${ProfileFieldsDetailed}

  query getUserProfile($address: String, $username: String) {
    profile: userProfile(address: $address, username: $username) {
      ...ProfileFieldsDetailed
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

export const TOKEN_QUERY = gql`
  query getToken($address: String!) {
    token: getToken(address: $address) {
      address
      symbol
      decimals
    }
  }
`

// export const DEPLOYER_QUERY = gql`
//   query deployer {
//     deployer: deployer() @client
//   }
// `

// export const DEPLOYER_QUERY = gql`
//   query deployer {
//     deployer: getDeployer() @client
//   }
// `

export const DEPLOYER_QUERY = gql`
  query deployer {
    deployer: getDeployer(symbol: $symbol) @client
  }
`

export const TOKEN_CLIENT_QUERY = gql`
  query getClientToken($tokenAddress: String!) {
    token: getClientToken(tokenAddress: $tokenAddress) @client
  }
`

export const TOKEN_ALLOWANCE_QUERY = gql`
  query getTokenAllowance(
    $userAddress: String!
    $tokenAddress: String!
    $partyAddress: String!
  ) {
    tokenAllowance: getTokenAllowance(
      userAddress: $userAddress
      tokenAddress: $tokenAddress
      partyAddress: $partyAddress
    ) @client
  }
`

export const TOKEN_SYMBOL_QUERY = gql`
  query getTokenBySymbol($symbol: String!) {
    token: getTokenBySymbol(symbol: $symbol) @client
  }
`

export const POAP_USERS_SUBGRAPH_QUERY = gql`
  query event($eventId: String!) {
    event: event(id: $eventId) {
      id
      tokens {
        id
        owner {
          id
        }
      }
    }
  }
`

export const GET_CONTRIBUTIONS_BY_PARTY = gql`
  query getContributionsByParty($address: String!) {
    getContributionsByParty(address: $address) {
      senderAddress
      recipientAddress
      amount
      createdAt
      decimals
    }
  }
`
export const GET_MAINNET_TOKEN_BALANCE = gql`
  query getMainnetTokenBalance(
    $userAddresses: [String]
    $tokenAddress: String!
  ) {
    getMainnetTokenBalance(
      userAddresses: $userAddresses
      tokenAddress: $tokenAddress
    ) @client
  }
`

export const SNAPSHOT_VOTES_SUBGRAPH_QUERY = gql`
  query Votes($userAddresses: [String]) {
    votes(first: 1000, where: { voter_in: $userAddresses }) {
      id
      voter
      created
      proposal {
        id
        title
        choices
      }
      choice
      space {
        id
        avatar
      }
    }
  }
`

export const POAP_BADGES_QUERY = gql`
  query poapBadges($userAddress: String!) {
    poapBadges: poapBadges(userAddress: $userAddress) @client
  }
`

export const ENS_NAME_QUERY = gql`
  query getEnsName($userAddress: String!) {
    getEnsName: getEnsName(userAddress: $userAddress) @client
  }
`

export const ENS_ADDRESS_QUERY = gql`
  query getEnsAddress($name: String!) {
    getEnsAddress: getEnsAddress(name: $name) @client
  }
`

export const NFT_QUERY = gql`
  query getNFTs($userAddress: String!) {
    getNFTs: getNFTs(userAddress: $userAddress) @client
  }
`
